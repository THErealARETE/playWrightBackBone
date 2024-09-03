import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/loginPage";
import { BaseUrls } from "../../config/url";
import { LoginSelectors } from "../../config/selectors/loginSelectors";
import { getLoginDetails } from "../../helpers/getLoginDetails";

test.describe("Login Page Tests", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test("Verify welcome message Upon successful Login and monitor Login network activity", async ({
        page,
    }) => {
        const { USERNAME, PASSWORD } = getLoginDetails();
        await loginPage.login(USERNAME, PASSWORD);
        await page.waitForResponse(
            response =>
                response.url().includes("/auth/login") && response.status() === 201
        );
        await page.waitForSelector(LoginSelectors.welcomeText);
        const welcomeMessage = page.locator(LoginSelectors.welcomeText);
        await expect(welcomeMessage).toHaveText(/Welcome/);
    });

    test("Verify page routed to upon successful login", async ({ page }) => {
        const { USERNAME, PASSWORD } = getLoginDetails();
        await loginPage.login(USERNAME, PASSWORD);
        await page.waitForResponse(
            response =>
                response.url().includes("/auth/login") && response.status() === 201
        );
        await page.waitForSelector(LoginSelectors.welcomeText, {
            state: "attached",
        });
        expect(page.url()).toBe(BaseUrls.home);
    });

    test("Verify session persistence upon succesful login and refresh", async ({
        page,
    }) => {
        const { USERNAME, PASSWORD } = getLoginDetails();
        await loginPage.login(USERNAME, PASSWORD);
        await page.waitForResponse(
            response =>
                response.url().includes("/auth/login") && response.status() === 201
        );
        await page.reload();
        await page.waitForSelector(LoginSelectors.welcomeText, {
            state: "attached",
        });
        expect(page.url()).toBe(BaseUrls.home);
    });

    test("Verify you cannot login with invalid credentials ", async ({
        page,
    }) => {
        const { USERNAME } = getLoginDetails();
        await loginPage.login(USERNAME, "invalidPassword");
        await page.waitForResponse(
            response =>
                response.url().includes("/auth/login") && response.status() === 401
        );
        const unauthorizedMessage = page.getByText("Unauthorized");
        await expect(unauthorizedMessage).toBeVisible();
    });

    test('Verify "Forgot Password" functionality redirects to the correct page', async ({
        page,
    }) => {
        const forgotPasswordLink = page.getByText("Forgot your password?");
        await forgotPasswordLink.click();
        expect(page.url()).toBe(BaseUrls.forgotPasswordPage);
    });

    test("Verify password field is of type password for security", async ({
        page,
    }) => {
        const passwordInputFIeld = page.getByRole(
            LoginSelectors.passwordInput.role,
            { name: LoginSelectors.passwordInput.name }
        );
        await expect(passwordInputFIeld).toHaveAttribute("type", "password");
    });

    test("Verify login attempt with invalid username format fails", async ({
        page,
    }) => {
        const { PASSWORD } = getLoginDetails();
        await loginPage.login("invalidFormat", PASSWORD);
        const errorMessage = page.getByTestId("test-input-feedback");
        await expect(errorMessage).toHaveText(
            /Please include an '@' in the email address/
        );
    });
});