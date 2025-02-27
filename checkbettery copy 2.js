import { remote } from "webdriverio";
import { expect } from "chai";
import { compareScreenshots,takeScreenshot,saveScreenshot,captureAndCompareScreenshot } from "./utils/screenshotUtils.js" // 📌 Import ฟังก์ชันที่สร้าง
import { label, link, issue, tms, step, attachment } from "allure-js-commons";

let driver;

const capabilities = {
  platformName: "Android",
  "appium:deviceName": "Xiaomi 10T Pro",
  "appium:platformVersion": "12",
  "appium:automationName": "UiAutomator2",
  "appium:appPackage": "com.android.settings",
  "appium:appActivity": ".Settings",
  "appium:noReset": true,
};

describe("Verify Scrolling and Clicking on Battery", function () {
  this.timeout(30000);

  before(async () => {
    driver = await remote({
      hostname: "localhost",
      port: 4723,
      // path: "/wd/hub",
      capabilities,
    });
  });

  it("Scroll to Battery and Click", async function () {
    // 📌 Allure Metadata
    allure.epic("Settings Navigation");
    allure.feature("Battery Menu");
    allure.story("Scroll to and Locate Battery Option");
    allure.severity("normal");
    

    
    // 📌 ค้นหา Battery
    const batteryElement = await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Battery"))'
    );

    // 📌 ตรวจสอบว่า Battery ปรากฏ
    expect(await batteryElement.isDisplayed()).to.be.true;
    await saveScreenshot(driver, "Battery Option");
    await batteryElement.click();
  });

  it("sample test", async () => {
    await label("foo", "bar");
    await link("https://allurereport.org", "custom", "Allure Web-Site");
    await issue("https://allurereport.org/fake-issue/1", "Issue 1");
    await issue("2", "Issue 2");
    await tms("https://allurereport.org/fake-task/1", "Task 1");
    await tms("2", "Task 2");
    await attachment("Sample text attachment", "Hello world!", "text/plain");
    await step("step 1", async () => {
      await step("step 1.1", async () => {
        await step("step 1.1.1", async () => {
          await attachment("Sample text attachment for step", "Goodbye world!", "text/plain");
        });
      });
    });
  });
  

  it("Check Battery Details Screen", async function () {
    // 📌 Allure Metadata
    allure.epic("Settings Navigation");
    allure.feature("Battery Menu");
    allure.story("Verify Details");
    allure.severity("critical");

    // 📌 ตรวจสอบว่าเข้าสู่หน้า Battery
    const batteryTitle = await driver.$("android.widget.TextView");
    expect(await batteryTitle.getText()).to.include("Battery");

    
    // 📌 ใช้ฟังก์ชันถ่ายภาพ
    // await takeScreenshot(driver, "Battery");
    // 📌 เรียกใช้ฟังก์ชันเช็คภาพ (ถ้าไม่ต้องการเช็ค ก็ไม่ต้องเรียก)
    await captureAndCompareScreenshot(driver, "Battery");
  });

  after(async () => {
    await driver.deleteSession();
  });
});
