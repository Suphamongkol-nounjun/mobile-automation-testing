const { remote } = require('webdriverio');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const allureReporter = require('@wdio/allure-reporter').default

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


describe('🔋 Battery Test', async function () {
  it('Open setting', async  () =>{
    const driver = await remote(wdOpts);
    console.log("Open Setting")
})




});
