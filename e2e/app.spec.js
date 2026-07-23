import { test, expect } from "@playwright/test";

const API = "http://localhost:8000/api";

const uid = Date.now().toString(36);

const SELLER = {
  username: `seller_${uid}`,
  email: `seller_${uid}@test.com`,
  password: "testpass123",
};
const BUYER = {
  username: `buyer_${uid}`,
  email: `buyer_${uid}@test.com`,
  password: "testpass123",
  phone_number: "254708374149",
};
const LISTING = {
  title: `E2E Test Item ${uid}`,
  description: "Seeded by automated E2E test.",
  price: 500 + (Date.now() % 10000),
};

test("full user journey", async ({ page, request }) => {
  // ─── Seed seller + listing via API ───────────────────────────────
  await request.post(`${API}/accounts/register/`, { data: SELLER });
  const login = await request.post(`${API}/accounts/login/`, {
    data: { email: SELLER.email, password: SELLER.password },
  });
  const { access } = await login.json();

  const create = await request.post(`${API}/listings/`, {
    data: {
      title: LISTING.title,
      description: LISTING.description,
      price: String(LISTING.price),
      category: 1,
    },
    headers: { Authorization: `Bearer ${access}` },
  });
  const listing = await create.json();
  expect(listing.id).toBeTruthy();

  // ─── 1. Unauthenticated user is redirected ──────────────────────
  await page.goto("/");
  await expect(page).toHaveURL("/login");
  await expect(page.getByText("Campus Marketplace")).toBeVisible();

  // ─── 2. Navigate to register ─────────────────────────────────────
  await page.getByText("Create an account").click();
  await expect(page).toHaveURL("/register");
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();

  // ─── 3. Register the buyer ───────────────────────────────────────
  await page.locator("input").nth(0).fill(BUYER.email);
  await page.locator("input").nth(1).fill(BUYER.username);
  await page.locator("input").nth(2).fill(BUYER.phone_number);
  await page.locator("input").nth(3).fill(BUYER.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("/", { timeout: 15000 });

  // ─── 4. Browse page shows the seeded listing ─────────────────────
  await expect(page.getByText(LISTING.title).first()).toBeVisible({ timeout: 10000 });
  await expect(
    page.getByText(`KSh ${LISTING.price.toLocaleString()}`).first(),
  ).toBeVisible();

  // ─── 5. Navbar shows logged-in links ────────────────────────────
  await expect(page.getByRole("link", { name: "Browse" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sell" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Messages" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();

  // ─── 6. Listing detail shows Buy button and Chat button ──────────
  await page.goto(`/listings/${listing.id}`);
  await expect(page.getByText(LISTING.title).first()).toBeVisible();
  await expect(page.getByText(LISTING.description)).toBeVisible();
  await expect(page.getByText("Buy this item")).toBeVisible();
  await expect(page.getByRole("button", { name: "Buy Now" })).toBeVisible();
  await expect(page.getByText("💬 Chat with seller")).toBeVisible();

  // ─── 7. Send a message via chat modal ────────────────────────────
  await page.getByRole("button", { name: "💬 Chat with seller" }).click();
  await expect(page.getByRole("heading", { name: "Chat with seller" })).toBeVisible();
  await page.getByPlaceholder("Type a message...").fill("Is this still available?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Is this still available?")).toBeVisible();

  // ─── 8. Messages page shows the conversation ─────────────────────
  await page.goto("/messages");
  await expect(page.getByRole("heading", { name: "Messages" })).toBeVisible();
  await expect(page.getByText("Is this still available?")).toBeVisible();

  // Click the conversation to see thread detail
  const convButton = page.locator("button").filter({ hasText: "Is this still available?" });
  if (await convButton.isVisible()) {
    await convButton.click();
    await expect(page.getByText("Is this still available?")).toBeVisible();
  }

  // ─── 9. Logout ──────────────────────────────────────────────────
  await page.goto("/");
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL("/login");

  // ─── 10. Logged-out user is redirected ───────────────────────────
  await page.goto("/");
  await expect(page).toHaveURL("/login");

  // ─── 11. Login again ────────────────────────────────────────────
  await page.locator("input").nth(0).fill(BUYER.email);
  await page.locator("input").nth(1).fill(BUYER.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/", { timeout: 15000 });
  await expect(page.getByText(LISTING.title).first()).toBeVisible();
});
