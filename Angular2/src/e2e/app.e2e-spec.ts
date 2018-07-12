import { MECPortalPage } from "./app.po";

describe("mecportal-node7 App", function() {
  let page: MECPortalPage;

  beforeEach(() => {
    page = new MECPortalPage();
  });

  it("should display message saying app works", () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual("app works!");
  });
});
