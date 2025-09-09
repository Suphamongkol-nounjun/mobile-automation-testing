// test/utils/visualUtils.js
import { expect } from '@wdio/globals';

/**
 * ทำการตรวจสอบภาพหน้าจอและยืนยันผล
 * @param {string} tagName - ชื่อแท็กของรูปภาพที่จะใช้เปรียบเทียบ
 */
export async function visualCheck(tagName) {
    await browser.pause(500); // ใส่ pause เล็กน้อยเผื่อหน้าจอมี animation
    const misMatchPercentage = await browser.checkScreen(tagName);
    await expect(misMatchPercentage).toEqual(0);
}