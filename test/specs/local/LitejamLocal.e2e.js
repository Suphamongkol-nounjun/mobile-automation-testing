// test/specs/local/LitejamLocal.e2e.js
import allure from '@wdio/allure-reporter';
import { browser, expect } from '@wdio/globals';
import ChordScreen from '../../pageobjects/chord.page.js';
import BluetoothPage from '../../pageobjects/bluetooth.page.js';
import { attachVisualTestResultsToAllure } from '../../../utils/allureUtils.js';
import { visualCheck } from '../../../utils/visualUtils.js';
import { startScreenRecording, stopScreenRecording } from '../../../utils/recordScreen.js';

// ✅ FIXED: ใช้ function() เพื่อรักษา Test Context
describe('Notero LiteJam Application Tests', function () {
    this.timeout(180000); // เพิ่มเวลา timeout สำหรับทุกเทสใน suite นี้

    // ✅ FIXED: ใช้ async function()
    before(async function () {
        console.log('--- beforeAll: Initial app setup and permission handling ---');
        await browser.pause(3000);
        const permissionsButton = await $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');
        if (await permissionsButton.isDisplayed()) {
            console.log('Permission 1 displayed, clicking...');
            await permissionsButton.click();
            await browser.pause(2000);
        }
        const locationButton = await $('id=com.android.permissioncontroller:id/permission_allow_button');
        if (await locationButton.isDisplayed()) {
            console.log('Permission 2 displayed, clicking...');
            await locationButton.click();
            await browser.pause(2000);
        }
        const introView = await $('//android.widget.ScrollView/android.view.View[3]');
        if (await introView.isDisplayed()) {
            console.log('Intro View displayed, clicking...');
            await introView.click();
            await browser.pause(2000);
        }
        console.log('--- beforeAll: Setup and permission handling done ---');
    });

    beforeEach(async function () {
        const testName = this.currentTest.title.replace(/\s+/g, '_');
        console.log(`--- beforeEach: Starting test "${testName}" ---`);
        await startScreenRecording();
        this.testNameForReport = testName;
    });

    afterEach(async function () {
        const testName = this.testNameForReport;
        await stopScreenRecording(testName);
        const screenshotBase64 = await browser.takeScreenshot();
        allure.addAttachment(`📷 Final Screenshot - ${testName}`, Buffer.from(screenshotBase64, 'base64'), 'image/png');
    });

    // ✅ FIXED: ใช้ function()
    describe('Application Startup and Connectivity', function () {
        allure.addFeature("Application Core");
        
        // ✅ REFACTORED: ใช้โครงสร้างที่สมบูรณ์
       it('TC-APP-001: should launch the app and default to Chord screen', async function () {
    const tagName = 'chord-screen-default';
    const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown';

    allure.addStory("App Launch & Default Screen");
    allure.startStep('Verify default screen visually');

    try {
        await visualCheck(tagName);
        allure.addStep('✅ UI matches the baseline image');
        allure.endStep('passed');

    } catch (error) {
        allure.addStep(`❌ Visual check failed: ${error.message}`);

        // ✅ แนบภาพก่อนปิด step
        attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);

        allure.endStep('failed'); // ปิด step หลังแนบภาพ

        throw error;
    }
});


        it('TC-APP-002: ควรเชื่อมต่อ Lite Jam RGB 24 ได้สำเร็จ และกลับมาหน้า Chord', async function () {
    const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown-device';
    const tags = {
        setting: 'tap-setting',
        bluetooth: 'bluetooth-menu'
    };

    allure.addStory("Bluetooth Connectivity");
    allure.startStep('Execute Bluetooth connection and return flow');

    try {
        await BluetoothPage.openSettingTab();
        await visualCheck(tags.setting);
        allure.addStep('✅ Navigated to Settings tab');

        await BluetoothPage.openBluetoothMenu();
        await visualCheck(tags.bluetooth);
        allure.addStep('✅ Opened Bluetooth & Device menu');

        await BluetoothPage.clickRefresh();
        await browser.pause(5000);
        allure.addStep('✅ Clicked Refresh and waited');

        const device = await BluetoothPage.findDeviceWithRetry('Lite Jam RGB 24');
        expect(device).not.toBeNull();
        allure.addStep('✅ Found "Lite Jam RGB 24" device');

        const success = await BluetoothPage.connectToDevice('Lite Jam RGB 24');
        expect(success).toBe(true);
        allure.addStep('✅ Device connected successfully');

        const backButton = await $('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
        await backButton.waitForDisplayed({ timeout: 5000 });
        await backButton.click();
        allure.addStep('✅ Navigated back to main screen');

        const chordTab = await $('~Chord\nTab 1 of 4');
        await chordTab.waitForDisplayed({ timeout: 5000 });
        expect(await chordTab.isDisplayed()).toBe(true);
        await chordTab.click();
        allure.addStep('✅ Verified return to Chord tab');

        allure.endStep('passed');

    } catch (error) {
        allure.addStep(`❌ Flow failed: ${error.message}`);

        // 🔥 แนบภาพทั้งหมดใน catch block เผื่อ fail แล้วไม่กลับมาที่ finally
        for (const tagName of Object.values(tags)) {
            attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder);
        }

        allure.endStep('failed');
        throw error;

    }
});

    });

    // ✅ FIXED: ใช้ function()
   describe('Check UI Chord Screen', function () {
    allure.addFeature("UI Verification");

    it('TC-APP-004: ควรแสดงผล UI ของหน้า Chord ได้อย่างถูกต้อง', async function () {
        const tagName = 'chord-screen-ui';
        const deviceNameForFolder = browser.capabilities.desired?.deviceName || browser.capabilities.deviceName || 'unknown-device';

        allure.addStory("Chord Screen");
        allure.startStep('Verify Chord Screen UI (Functional & Visual)');

        try {
            // ✅ Functional UI Check
            await ChordScreen.verifyChordScreenUI();
            allure.addStep('✅ Functional check passed');

            // ✅ Visual UI Check
            await visualCheck(tagName);
            allure.addStep('✅ Visual check passed');

            allure.endStep('passed');

        } catch (error) {
            allure.addStep(`❌ Test failed: ${error.message}`);
            attachVisualTestResultsToAllure(allure, tagName, deviceNameForFolder); // ⬅ แนบแม้ fail
            allure.endStep('failed');
            throw error;
        }
    });
});
});
