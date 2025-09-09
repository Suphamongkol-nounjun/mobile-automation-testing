// test/specs/app.launch.spec.js
import allure from '@wdio/allure-reporter';
import { expect } from '@wdio/globals'; 
import { captureAndCompareScreenshot, takeScreenshot } from '../utils/screenshotUtils'; 
import { startScreenRecording,stopScreenRecording } from '../utils/recordScreen';
import fs from 'fs';
import path from 'path';

describe('Application Startup and Default State', function () {
  this.timeout(90000); 

  allure.addFeature("Application Core");
  allure.addStory("App Launch & Default Screen");

before(async () => {
  console.log('--- beforeAll: Initial app setup and permission handling ---');

  // Pause for app to launch
  await browser.pause(3000); 

  // กรณีที่ต้องเคลียร์ app (เปิดใช้เมื่อจำเป็น)
  // await driver.execute('mobile: clearApp', { appId: 'co.notero.litejam' });
  // await browser.pause(3000); 

  // Handle permission 1
  const permissionsButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
  if (await permissionsButton.isDisplayed()) {
    console.log('Permission 1 displayed, clicking...');
    await permissionsButton.click();
    await browser.pause(2000);
  }

  // Handle permission 2
  const locationButton = await $('id=com.android.permissioncontroller:id/permission_allow_button');
  if (await locationButton.isDisplayed()) {
    console.log('Permission 2 displayed, clicking...');
    await locationButton.click();
    await browser.pause(2000);
  }

  // ScrollView View[3] คลิกเพื่อเข้าหน้าแรก
  const introView = await $('//android.widget.ScrollView/android.view.View[3]');
  if (await introView.isDisplayed()) {
    console.log('Intro View displayed, clicking...');
    await introView.click();
    await browser.pause(2000);
  }

  console.log('--- beforeAll: Setup and permission handling done ---');
});

 beforeEach(async function () {
    const testName = this.currentTest.title.replace(/\s+/g, '_'); // แปลงชื่อให้ใช้เป็นชื่อไฟล์ได้
    console.log(`--- beforeEach: Starting test "${testName}" ---`);
    await startScreenRecording();
    this.testNameForReport = testName; // เก็บไว้ใช้ตอนหลังEach
  });

afterEach(async function () {
  const testName = this.testNameForReport;
  await stopScreenRecording(testName);

  const screenshotBase64 = await browser.takeScreenshot();
  allure.addAttachment(`📷 Screenshot - ${testName}`, Buffer.from(screenshotBase64, 'base64'), 'image/png');
});

  it('TC-APP-001: should launch the app and default to Chord screen', async function () {
     allure.startStep('Verify default screen is Chord tab and content'); 

    // 1. Verify "Guitar Chords" text (main title or introductory text)
    const guitarChordsText = await $('~Guitar Chords'); 
    await expect(guitarChordsText).toBeExisting();
    await expect(guitarChordsText).toBeDisplayed();
    await expect(guitarChordsText).toHaveAttr('content-desc', 'Guitar Chords'); 
    allure.addStep('Verified "Guitar Chords" text (via content-desc) is displayed correctly.'); 

    // 2. Verify "Please choose a root note and a chord type." text
    const instructionText = await $('~Please choose a root note and a chord type.'); 
    await expect(instructionText).toBeExisting();
    await expect(instructionText).toBeDisplayed();
    // --- แก้ไขโค้ดส่วนนี้ ---
    await expect(instructionText).toHaveAttr('content-desc', 'Please choose a root note and a chord type.'); 
    allure.addStep('Verified instruction text (via content-desc) is displayed correctly.'); 
    // --- สิ้นสุดการแก้ไขโค้ด ---

    // 3. Verify Fretboard (HorizontalScrollView) is displayed
    const fretboard = await $('android.widget.HorizontalScrollView'); 
    await expect(fretboard).toBeExisting();
    await expect(fretboard).toBeDisplayed();
    allure.addStep('Verified Fretboard is displayed.'); 

    // 4. Verify "Choose your Chord" text
    const chooseYourChordText = await $('~Choose your Chord'); 
    await expect(chooseYourChordText).toBeExisting();
    await expect(chooseYourChordText).toBeDisplayed();
    // --- แก้ไขโค้ดส่วนนี้ ---
    await expect(chooseYourChordText).toHaveAttr('content-desc', 'Choose your Chord');
    allure.addStep('Verified "Choose your Chord" text (via content-desc) is displayed correctly.'); 
    // --- สิ้นสุดการแก้ไขโค้ด ---

    // 5. Verify "Chord Tab" (main navigation button/icon) is displayed and active
    const chordTab = await $('~Type of chord...'); 
    await expect(chordTab).toBeExisting();
    await expect(chordTab).toBeDisplayed();
    await expect(chordTab).toHaveAttr('content-desc', 'Type of chord...');
    allure.addStep('Verified "Chord Tab" is displayed and active.'); 
    allure.endStep("passed"); 

    console.log('TC-APP-001 completed successfully on', browser.capabilities.deviceName);
  });

  it('TC-APP-002: should find and click Bluetooth device', async function () {
 allure.startStep('Navigating to Bluetooth Settings');

  // 1. คลิกปุ่ม Setting (Tab 4 of 4)
  const settingTab = await $('~Setting\nTab 4 of 4');
  await settingTab.waitForDisplayed({ timeout: 5000 });
  await settingTab.click();
  allure.addStep('Navigated to Setting tab');

  // 2. คลิก Bluetooth & Device
  const bluetoothMenu = await $('~Bluetooth & Device');
  await bluetoothMenu.waitForDisplayed({ timeout: 5000 });
  await bluetoothMenu.click();
  allure.addStep('Navigated to Bluetooth & Device');

  // 3. คลิกปุ่ม Refresh ทันที
const refreshBtn = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.widget.Button');
await refreshBtn.waitForDisplayed({ timeout: 5000 });
await refreshBtn.click();
  allure.addStep('Clicked refresh button');

  // 4. รอ 5 วิ ให้ระบบค้นหาอุปกรณ์
  await browser.pause(5000);
  allure.addStep('Waited 5 seconds for devices to load');

  // 5. พยายามหาชื่อ "Lite Jam RGB 24" ด้วยการ refresh ซ้ำได้อีกสูงสุด 2 ครั้ง
  let deviceFound = false;
  for (let i = 0; i < 3; i++) {
    const device = await $('~Lite Jam RGB 24');
    if (await device.isDisplayed()) {
      deviceFound = true;
      await device.click();
      allure.addStep(`Found and clicked on device: Lite Jam RGB 24 (on attempt ${i + 1})`);
      break;
    }

    if (i < 2) {
      await refreshBtn.click();
      allure.addStep(`Refresh attempt #${i + 2}`);
      await browser.pause(5000);
    }
  }

  if (!deviceFound) {
    allure.addStep('❌ Device "Lite Jam RGB 24" not found after multiple refreshes.');
  allure.endStep('failed'); // ✅ แจ้ง Allure ว่า fail
  throw new Error('Device "Lite Jam RGB 24" not found after multiple refreshes.');
  }
  const connectButtons = await $$('//android.view.View[@content-desc="Lite Jam RGB 24"]/android.widget.Button');

for (const button of connectButtons) {
  await button.waitForDisplayed({ timeout: 5000 });
  await button.click();
  allure.addStep('Clicked on Connect Bluetooth button');

  // รอเช็คว่ามีข้อความ "Connecting..." ปรากฏหรือไม่ ภายใน 5 วิ
  try {
    const connectingText = await $('~Connecting...');
    await connectingText.waitForDisplayed({ timeout: 5000 });

    // ถ้ามีข้อความ Connecting... ให้รอข้อความ "(Connect: 1 Device)" ปรากฏ
    const connectText = await $('~(Connect: 1 Device)');
    const connectedText = await $('~CONNECTED');
    await connectedText.waitForDisplayed({ timeout: 5000 });
    await connectText.waitForDisplayed({ timeout: 5000 });
    await connectText.waitForDisplayed({ timeout: 5000 });
    const isDisplayed = await connectText.isDisplayed();
    expect(isDisplayed).toBe(true);
    allure.addStep('✅ Checked that "(Connect: 1 Device)" is displayed');

    allure.endStep('passed');
    console.log('TC-APP-002 completed successfully on', browser.capabilities.deviceName);

  } catch (err) {
    // ถ้าไม่มีข้อความ Connecting... ก็ข้ามไปกดปุ่มถัดไปได้เลย
    allure.addStep('No "Connecting..." text appeared, moving to next button');
  }
  // เว้นช่วงเล็กน้อยก่อนกดปุ่มถัดไป
  await browser.pause(3000);
}

allure.endStep('passed');
  console.log('TC-APP-002 completed successfully on', browser.capabilities.deviceName);
});

it('TC-APP-003: xxxxxxx', async function () {
 // กดปุ่ม Back ด้วย XPath ที่ให้มา
const backButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
await backButton.waitForDisplayed({ timeout: 5000 });
await backButton.click();
allure.addStep('Clicked Back button to navigate back');

// รอหน้าเปลี่ยน และตรวจสอบ element accessibility id "Chord\nTab 1 of 4"
const chordTab = await $('~Chord\nTab 1 of 4');
await chordTab.waitForDisplayed({ timeout: 5000 });
const isDisplayed = await chordTab.isDisplayed();
expect(isDisplayed).toBe(true);
await chordTab.click();
allure.addStep('Verified accessibility id "Chord\\nTab 1 of 4" is displayed after back navigation');
  allure.endStep("passed");
  console.log('TC-APP-003 completed successfully on', browser.capabilities.deviceName);
});
});