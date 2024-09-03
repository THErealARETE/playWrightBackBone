import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../helpers/apiHelpers/apiHelpers';
import { validateBlockDetails, validateTransactionDetails, validateInvalidParameterResponse } from '../../helpers/apiHelpers/apiValidationHelpers';

let apiHelper: ApiHelper;

test.beforeAll(async () => {
  apiHelper = new ApiHelper();
  await apiHelper.initContext(); 
});

test.afterAll(async () => {
  await apiHelper.disposeContext();
});

test('Positive API Test: Verify latest block and respective transaction details', async () => {
  const blockNumberResponse = await apiHelper.fetchLatestBlockNumber();
  const blockNumberHex = blockNumberResponse.result;
  expect(blockNumberResponse).not.toBeNull();

  const blockDetails = await apiHelper.fetchBlockDetails(blockNumberHex);
  expect(blockDetails).not.toBeNull();
  validateBlockDetails(blockDetails.result, blockNumberHex);

  const transactionHash = blockDetails.result.transactions[0];
  const transactionDetails = await apiHelper.fetchTransactionDetails(transactionHash);
  expect(transactionDetails).not.toBeNull();
  validateTransactionDetails(transactionDetails.result, transactionHash);
});

test('Negative API Test: Verify invalid block number and invalid transaction hash return with the appropriate error messages', async () => {
  const invalidBlockNumber = '0x123456789abcdef';
  const invalidBlockDetails = await apiHelper.fetchBlockDetails(invalidBlockNumber);
  expect(invalidBlockDetails.result).toBeNull();

  const invalidTransactionHash = '0xinvalidhash';
  const invalidTransactionDetails = await apiHelper.fetchTransactionDetails(invalidTransactionHash);
  validateInvalidParameterResponse(invalidTransactionDetails, -32602, 'Invalid params');
});
