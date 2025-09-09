import { $ } from '@wdio/globals';

class ChordScreen {
  // 🔹 เก็บ locators ทั้งแบบ content-desc และ className
  locators = {
    guitarChordsText: 'Guitar Chords',
    instructionText: 'Please choose a root note and a chord type.',
    chooseYourChordText: 'Choose your Chord',
    chordTabText: 'Type of chord...',
    fretboardClass: 'android.widget.HorizontalScrollView',
  };

  // 🔹 ใช้ getter เพื่อเข้าถึง element แบบเป็นระบบ
  get guitarChordsText() {
    return $(`~${this.locators.guitarChordsText}`);
  }

  get instructionText() {
    return $(`~${this.locators.instructionText}`);
  }

  get chooseYourChordText() {
    return $(`~${this.locators.chooseYourChordText}`);
  }

  get chordTab() {
    return $(`~${this.locators.chordTabText}`);
  }

  get fretboard() {
    return $(this.locators.fretboardClass); // class name ไม่มี ~
  }

  // 🔹 รวม method ตรวจสอบทั้งหมดในจุดเดียว
  async verifyChordScreenUI() {
    await expect(this.guitarChordsText).toBeExisting();
    await expect(this.guitarChordsText).toBeDisplayed();
    await expect(this.guitarChordsText).toHaveAttr('content-desc', this.locators.guitarChordsText);

    await expect(this.instructionText).toBeExisting();
    await expect(this.instructionText).toBeDisplayed();
    await expect(this.instructionText).toHaveAttr('content-desc', this.locators.instructionText);

    await expect(this.fretboard).toBeExisting();
    await expect(this.fretboard).toBeDisplayed();

    await expect(this.chooseYourChordText).toBeExisting();
    await expect(this.chooseYourChordText).toBeDisplayed();
    await expect(this.chooseYourChordText).toHaveAttr('content-desc', this.locators.chooseYourChordText);

    await expect(this.chordTab).toBeExisting();
    await expect(this.chordTab).toBeDisplayed();
    await expect(this.chordTab).toHaveAttr('content-desc', this.locators.chordTabText);
  }
}

export default new ChordScreen();
