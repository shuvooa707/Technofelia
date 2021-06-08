const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}


(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://vidembed.net/streaming.php?id=MzM3MDg2');
    // other actions...
    // page.click("body");

    // await page.keyboard.press('Space', { delay: 1000 });
    // await page.keyboard.press('Space', { delay: 1000 });
    // await page.keyboard.press('Space', { delay: 1000 });

    // await page.mouse.click(743, 196);
    // await page.mouse.click(744, 363, { delay: 1000 });
    await page.mouse.click(730, 398, { delay: 2000 });
    await page.mouse.click(730, 398, { delay: 2000 });
    await page.mouse.click(730, 398, { delay: 2000 });
    // // await page.mouse.click(743, 196);
    //     await page.evaluate(() => {
    //     let dom = document.querySelector('button.vjs-big-play-button');
    //     dom.click();
    // });
    // let url = await page.evaluate(() => {
    //     let url = document.querySelector("#videojs_html5_api");
    //     return url.src;
    // });

    // fs.writeFileSync("output.txt", url);



    await page.screenshot({ path: 'screenshot.png' },);



    await browser.close();

})();