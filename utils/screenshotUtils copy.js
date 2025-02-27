import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "fs";
import { expect } from "chai";

/**
 * ถ่ายภาพหน้าจอและบันทึกเป็นไฟล์
 * @param {WebdriverIO.Browser} driver - WebDriverIO driver instance
 * @param {string} testName - ชื่อ Test Case ใช้ตั้งชื่อไฟล์ภาพ
 */


export async function takeScreenshot(driver, testName) {
    const screenshot = await driver.takeScreenshot();
    const filePath = `./allure-results/${testName}-actual.png`;
    fs.writeFileSync(filePath, Buffer.from(screenshot, "base64"));
    return filePath; // ส่ง path ของภาพกลับไปใช้ต่อ
  }

  

export async function saveScreenshot(driver, testName) {
    const screenshot = await driver.takeScreenshot();
    const filePath = `./allure-results/${testName}-actual.png`;
    fs.writeFileSync(filePath, Buffer.from(screenshot, "base64"));
    allure.createAttachment(`${testName} - Screenshot`, fs.readFileSync(filePath), "image/png");
        
};



export function compareScreenshots(testName) {
  const expectedPath = `./allure-results/${testName}-expected.png`;
  const actualPath = `./allure-results/${testName}-actual.png`;
  const diffPath = `./allure-results/${testName}-diff.png`;

  if (fs.existsSync(expectedPath)) {
    const expected = PNG.sync.read(fs.readFileSync(expectedPath));
    const actual = PNG.sync.read(fs.readFileSync(actualPath));
    const { width, height } = expected;

    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(expected.data, actual.data, diff.data, width, height, {
      threshold: 0.2, // ปรับ sensitivity
      includeAA: false,
    });

    // 📌 แนบรูป Actual ขึ้น Allure Report เสมอ
    allure.createAttachment(`${testName} - Actual Image`, fs.readFileSync(actualPath), "image/png");

    if (numDiffPixels > 0) {
      // 📌 บันทึกไฟล์ diff และแนบเข้า Allure ถ้ามีความต่าง
      fs.writeFileSync(diffPath, PNG.sync.write(diff));

      allure.createAttachment(`${testName} - Expected Image`, fs.readFileSync(expectedPath), "image/png");
      allure.createAttachment(`${testName} - Diff Image`, fs.readFileSync(diffPath), "image/png");

      // 📌 ถ้าเจอความต่าง โยน error
      expect(numDiffPixels, `There are visual differences in ${testName}!`).to.equal(0);
    }
  } else {
    // 📌 ถ้ายังไม่มี expected image → เซฟ actual เป็น baseline
    fs.copyFileSync(actualPath, expectedPath);
    console.log(`📌 No baseline image found for ${testName}. Saving current screenshot as baseline.`);

    // 📌 แนบรูป actual ไว้ใน Allure Report
    allure.createAttachment(`${testName} - Screenshot`, fs.readFileSync(actualPath), "image/png");
  }
}

export async function captureAndCompareScreenshot(driver, testName) {
    const screenshot = await driver.takeScreenshot();
    const actualPath = `./allure-results/${testName}-actual.png`;
    fs.writeFileSync(actualPath, Buffer.from(screenshot, "base64"));
    
    const expectedPath = `./allure-results/${testName}-expected.png`;
    const diffPath = `./allure-results/${testName}-diff.png`;

  if (fs.existsSync(expectedPath)) {
    const expected = PNG.sync.read(fs.readFileSync(expectedPath));
    const actual = PNG.sync.read(fs.readFileSync(actualPath));
    const { width, height } = expected;

    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(expected.data, actual.data, diff.data, width, height, {
      threshold: 0.2, // ปรับ sensitivity
      includeAA: false,
    });

    // 📌 แนบรูป Actual ขึ้น Allure Report เสมอ
    allure.createAttachment(`${testName} - Actual Image`, fs.readFileSync(actualPath), "image/png");

    if (numDiffPixels > 0) {
      // 📌 บันทึกไฟล์ diff และแนบเข้า Allure ถ้ามีความต่าง
      fs.writeFileSync(diffPath, PNG.sync.write(diff));

      allure.createAttachment(`${testName} - Expected Image`, fs.readFileSync(expectedPath), "image/png");
      allure.createAttachment(`${testName} - Diff Image`, fs.readFileSync(diffPath), "image/png");

      // 📌 ถ้าเจอความต่าง โยน error
      expect(numDiffPixels, `There are visual differences in ${testName}!`).to.equal(0);
    }
  } else {
    // 📌 ถ้ายังไม่มี expected image → เซฟ actual เป็น baseline
    fs.copyFileSync(actualPath, expectedPath);
    console.log(`📌 No baseline image found for ${testName}. Saving current screenshot as baseline.`);

    // 📌 แนบรูป actual ไว้ใน Allure Report
    allure.createAttachment(`${testName} - Screenshot`, fs.readFileSync(actualPath), "image/png");
  }
}
