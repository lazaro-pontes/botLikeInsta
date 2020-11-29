require('dotenv').config();
const puppeteer = require('puppeteer');
var readlineSync = require('readline-sync');

const run = async () => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 746 })


    //faz o login 
    const igLogin = async () => {
        console.log("logando no instagram")

        await page.goto('https://www.instagram.com');

        await page.waitForSelector('[name="username"]', { timeout: 60000 });
        await page.type('[name="username"]', process.env.EMAIL);

        await page.waitForSelector('[name="password"]', { timeout: 60000 });
        await page.type('[name="password"]', process.env.PASSWORD);

        await page.click('[type="submit"]', { delay: 2300 });

        console.log(`login concluido na conta: ${process.env.EMAIL}`)
    }

    //fecha os modals de notificaçao 
    const closeModals = async () => {
        console.log("fechando modals")

        await page.waitForNavigation();
        await page.goto('https://www.instagram.com');
        await page.click('[class="aOOlW   HoLwm "]', { delay: 1500 })

        console.log("buscando perfil")
    }

    //visita perfil
    const visitProfile = async () => {
        const gridClass = '.ySN3v'
        const lineClass = '.Nnq7C'
        const hasLikeClass = 'div.QBdPU > span > svg[aria-label="Curtir"]'
        const timeToClick = (2 + Math.random()) * 500
        const userProfile = readlineSync.question('> digite um perfil do instagram: ') || process.env.PERFIL
        
        
        
        await page.goto(`https://www.instagram.com/${userProfile}`)
        console.log(`acessando perfil: ${userProfile}`)
        
        await page.waitForSelector(lineClass)
        for (let i = 1; i < (await page.$$(lineClass)).length; i++) {
            const linha = i;

            const children = await page.evaluate(() => {
                return (Array.from(document.querySelector('.Nnq7C').children).length);
            })

            for (let p = 1; p <= children; p++) {
                const post = p;
                
                //selecionar post do grid
                await page.waitForSelector(gridClass)
                await page.click(
                    `${gridClass} > div > div > 
                    .Nnq7C:nth-child(${linha}) > 
                    .v1Nh3:nth-child(${post})`, { delay: timeToClick }
                )
                console.log(`selecionando foto ${post} da linha ${linha}`)

                //verifica o status de like da foto e curti caso precise
                await page.waitForSelector('div.QBdPU > span')
                if(await page.$(hasLikeClass) !== null) {
                    await page.click('div.QBdPU > span > [aria-label="Curtir"]')
                    console.log("curtindo!!!!")
                }
                await page.keyboard.press("Escape", { delay: timeToClick })
            }

        }
    }

    await igLogin()
    await closeModals()
    await visitProfile()
    await browser.close();
};

run().catch(e => console.log(`> ${e.message}`))


