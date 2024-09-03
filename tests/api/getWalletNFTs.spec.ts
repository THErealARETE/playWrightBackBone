import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../helpers/apiHelpers/apiHelpers';
import {
  validateNftMetadata,
  validateNftOwnerAndContractType,
  validatePagination,
  validateBlockNumbers,
  validateNftImageAndLogo,
  validateInvalidTokenAddress,
  validatePostMethodNotAllowed
} from '../../helpers/apiHelpers/apiValidationHelpers';

let apiHelper: ApiHelper;

test.describe('GET wallet NFTs API Tests', () => {
  test.beforeAll(async () => {
    apiHelper = new ApiHelper();
    await apiHelper.initContext();
  });

  test.afterAll(async () => {
    await apiHelper.disposeContext();
  });

  test('Positive Test: Verify that NFT metadata exists and is valid', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();
    const nft = responseData.result[0];

    expect(response.status()).toBe(200);
    expect(responseData).toHaveProperty('result');
    validateNftMetadata(nft);
  });

  test('Positive Test: Verify NFT owner, contract type, and their types', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();
    const nft = responseData.result[0];

    expect(response.status()).toBe(200);
    validateNftOwnerAndContractType(nft);
  });

  test('Positive Test: Verify pagination metadata and types', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();

    expect(response.status()).toBe(200);
    validatePagination(responseData);
  });

  test('Positive Test: Verify metadata, rarity, and types for specific NFTs', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();
    const nft = responseData.result[0];

    expect(response.status()).toBe(200);
    validateNftMetadata(nft);

    if (nft.rarity_rank !== null) {
      expect(typeof nft.rarity_rank).toBe('number');
      expect(nft.rarity_rank).toBeGreaterThan(0);
    }

    if (nft.rarity_label !== null) {
      expect(typeof nft.rarity_label).toBe('string');
      expect(nft.rarity_label).toMatch(/Top \d+%/);
    }
  });

  test('Positive Test: Verify NFT image, collection logo, and types', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();
    const nft = responseData.result[0];

    expect(response.status()).toBe(200);
    validateNftImageAndLogo(nft);
  });

  test('Positive Test: Verify block numbers for the NFTs and their types', async () => {
    const response = await apiHelper.getNfts();
    const responseData = await response.json();
    const nft = responseData.result[0];

    expect(response.status()).toBe(200);
    validateBlockNumbers(nft);
  });

  

  test('Negative Test: Verify Invalid token address returns error', async () => {
    const invalidTokenAddress = '0xinvalidhex';
    const response = await apiHelper.getNftsWithTokenAddress(invalidTokenAddress);
    const responseData = await response.json();

    expect(response.status()).toBe(200);
    validateInvalidTokenAddress(responseData, invalidTokenAddress);
  });

  test('Negative Test: Verify POST request returns 404 as it is not supported', async () => {
  const response = await apiHelper.postNfts();
  
  const contentType = response.headers()['content-type'];
  if (contentType && contentType.includes('application/json')) {
    const responseData = await response.json();
    validatePostMethodNotAllowed(response, responseData);
  } else {
    expect(response.status()).toBe(404);
  }
});


  
});
