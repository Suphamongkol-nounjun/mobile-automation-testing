const { remote } = require('webdriverio');

const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  path: process.env.APPIUM_PATH || '/wd/hub',
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    // Scroll ลงไปที่ "Battery"
    const batteryItem = await driver.$(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Battery"))'
    );
    await batteryItem.click();

    const batteryLevelElement = await driver.$('id=com.miui.securitycenter:id/power_last_level');
    const batteryRemainingID = await driver.$('id=com.miui.securitycenter:id/number');
    
    const batteryLevel = await batteryLevelElement.getText();
    const batteryRemainingTime = await batteryRemainingID.getText();

    console.log(`🔋 Battery Level: ${batteryLevel}`);
    console.log(`⏳ Battery Remaining time: ${batteryRemainingTime}`);

  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);
