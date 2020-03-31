const ottersArray = [
    'https://www.sciencesetavenir.fr/assets/img/2019/08/27/cover-r4x3w1000-5d64fde6d1355-sipa-00864680-000003.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/8/82/LutraCanadensis_fullres.jpg',
    'https://lemagdesanimaux.ouest-france.fr/images/dossiers/2019-09/loutre-1-085135.jpg',
    'https://www.leparisien.fr/resizer/_DWtgMkaTw8GDcn-vnHKoed7jGY=/932x582/arc-anglerfish-eu-central-1-prod-leparisien.s3.amazonaws.com/public/3CHSMG36WWYUMU36GPT57KM5C4.jpg',
    'https://jardinage.lemonde.fr/images/dossiers/2017-05/loutre-164326.jpg',
    'https://zooecomuseum.ca/workspace/uploads/animals/loutre-fr-1576013136.jpg',
    'https://images.ladepeche.fr/api/v1/images/view/5c191a488fe56f070e4715d0/large/image.jpg',
    'https://img.20mn.fr/vmusmUDoT_enbz8ZVHKhGA/830x532_loutre-cendree.jpg',
    'https://www.oceanopolis.com/wp-content/uploads/2019/01/loutre-de-mer-enhydra-lutris.jpg',
    'https://www.vivre-a-niort.com/fileadmin/ville/archives/VAN/2019/juillet/accessible/images/0008-1.jpg',
    'https://cdn.radiofrance.fr/s3/cruiser-production/2020/02/6ed550ab-2303-4111-9213-58f822c8f43e/870x489_loutre_tlmd_15_fevrier.jpg',
    'https://lh3.googleusercontent.com/proxy/QThVcza9lavMpPZx57_4--9bTWMu2XKELlxb279iJ0rBIgiA7uaJgaigUjWYxid1FP1Sccp4fP570wVc5Fs7XgJBNyoxidnRYnrz1nx-H64nvYQAY2BRwG-NWqA',
    'https://img.bfmtv.com/c/1256/708/94a/2cda6bb716a96a8736fd4a9e6309d.jpeg',
    'https://lh4.googleusercontent.com/proxy/rBYrsuTPil_x9L9DacHoKQ8kgn_KWHt9Y87mbfjBb9q-4W3xQPwJiUkoBwpUOCtsIGNAFZUrls6hu7aLBl1cvl_vzSODq7APHtpcawNiYpS6Xw-sXtoZ0ECDu5jqFk1GeSwJvQ',
    'https://download.vikidia.org/vikidia/fr/images/thumb/a/af/Loutre_d%27Europe_-_Lutra_lutra_%281%29.jpg/250px-Loutre_d%27Europe_-_Lutra_lutra_%281%29.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Petite-loutre01.JPG/1200px-Petite-loutre01.JPG',
    'https://static.lpnt.fr/images/2018/12/21/17792283lpw-17792282-article-jpg_5825528.jpg',
    'https://www.wapiti-magazine.com/wp-content/uploads/sites/26/2018/12/loutre-de-mer.jpg',
    'https://media.ouest-france.fr/v1/pictures/MjAxNDA4N2MwYTVjYmUwYjljZTgxNjY1Yjk3NGRjNTE2MGFmZDU?width=480&height=270&focuspoint=50%2C25&cropresize=1&client_id=bpeditorial&sign=23e58ebfbe34789d5e4a5477ee46a3ad6fbecb683411e3c9dc9ce0dbd2841855',
    'https://i.ytimg.com/vi/aZSKeA2e8h4/maxresdefault.jpg',
    'https://i0.wp.com/espritdepays.com/dordogne/wp-content/uploads/2018/03/Loutre-europeenne-en-Dordogne.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Loutre2.jpg/220px-Loutre2.jpg',
    'https://www.thoiry.net/sites/thoiry.net/files/2018-02/loutre1600x800.jpg',
    'https://www.parc-animalier-pyrenees.com/Fichiers/animaux/111641teteloutre-parcanimalierdespyrenees-argelesgazost.jpg',
    'https://cdn.radiofrance.fr/s3/cruiser-production/2019/10/ec9daad0-4ca1-42f9-a93f-8b11b15a6c27/870x489_c_rachel_kuhn.jpg',
    'https://www.sciencesetavenir.fr/assets/img/2016/03/30/cover-r4x3w1000-57e1733611fc8-loutre-cendree.jpg',
    'https://images.radio-canada.ca/q_auto,w_1250/v1/ici-info/16x9/loutre-de-mer-pierre-coquillage-outils.jpg',
    'https://www.letelegramme.fr/ar/imgproxy.php/images/2012/12/22/1952197_13662958-fin502-20121218-h101a.jpg?article=20121222-1001952197&aaaammjj=20121222',
    'https://resize-parismatch.lanmedia.fr/img/var/news/storage/images/paris-match/animal-story/photos/la-maman-loutre-jamais-sans-son-petit-898439/9521715-1-fre-FR/La-maman-loutre-jamais-sans-son-petit.jpg',
    'https://zooecomuseum.ca/workspace/uploads/modules/_mg_5250-fr-1576013081.jpg',
    'https://www.wwf.fr/sites/default/files/styles/page_cover_large_16_9/public/2017-05/287388-.jpg?h=9b24eb84&itok=fRXUCARF',
    'https://www.lille.fr/var/www/storage/images/mediatheque/mairie-de-lille/n1/que-faire-a-lille/envie-de-nature/images/parcs-jardins-et-zoo/loutre/307571-1-fre-FR/loutre_news_image_top.jpg',
    'https://resize-parismatch.lanmedia.fr/img/var/news/storage/images/paris-match/actu/international/etats-unis-mais-qui-est-le-tueur-des-loutres-de-mer-1048681/14863942-1-fre-FR/Etats-Unis-Mais-qui-est-le-tueur-des-loutres-de-mer.jpg',
    'https://mon.astrocenter.fr/vss/pictures/25203979-loutre-1366x768.jpg',
    'https://www.anigaido.com/media/zoo_animaux/101-200/160/loutre-cendreacutee-1-hamikus-pixabay-cc0-xl.jpg',
    'https://www.lamontagne.fr/photoSRC/VVNUJ1paUTgIBhVOCRAHHQ4zRSkXaldfVR5dW1sXVA49/le-banquet-des-loutres-de-ronan-fournie-christol-rencontres-_4605899.jpeg',
    'https://www.pairidaiza.eu/sites/default/files/styles/poi_banner/public/media/image/Loutre-Asiatique-HEADERR.jpg?h=a1e1a043&itok=hfxwcL6Y',
    'https://cdn-s-www.leprogres.fr/images/2ED1B9C5-6B69-467E-AFB2-19C5DF55F29D/NW_detail_M/title-1576680650.jpg',
    'https://photos.lci.fr/images/613/344/srgzr-1-a4df4e-0@1x.png',
    'https://cdn1.bioparc-zoo.fr/wp-content/uploads/2020/02/bioparc-parc-zoologique-loutre-geante.jpg',
    'https://www.lyonmag.com/medias/images/loutres1-dr.jpg',
    'https://www.hellodemain.com/image/57c7dfe3369ff_6N86dJsBk0SdRxmY6oBrCchpSrE@906x453.png',
    'https://images.radio-canada.ca/q_auto,w_1250/v1/ici-info/16x9/eddie-loutre-zoo-oregon-mort.jpg',
    'https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/7/6/5/765dfc550e_50036563_800px-fischotter-lutra-lutra3.jpg',
    'https://cache.cosmopolitan.fr/data/photo/w1000_ci/4z/bebe-loutre.jpg',
    'https://www.lepoint.fr/images/2020/02/13/20054314lpw-20054359-article-loutre-faune-eure-jpg_6909257_1250x625.jpg',
    'https://www.zoorigin.com/media/thumbnail/article_cover/media/images/xla-disparition-croissante-des-loutres-de-mer.jpg.pagespeed.ic.-_eKcK306f.jpg',
    'https://img.aws.la-croix.com/2018/01/18/1200906845/Loutre_0_729_486.jpg',
    'https://img.maxisciences.com/article/480/international/recemment-une-loutre-de-mer-femelle-etablie-dans-les-eaux-de-morro-bay-en-californie-a-fait-naitre-non-pas-un-mais-deux-petits-un-frere-et-une-soeur_5f73ace8d01db5fb09ca3cb851ca688fb0f5ad0e.jpg',
    'https://ds1.static.rtbf.be/article/image/1248x702/6/7/a/16105fb9cc614fc29e1bda00dab60d41-1450975359.jpg'
];

const {getRandomInt} = require('./dependencies/_getRandomInt');
const Discord = require('discord.js');
const {dictionary} = require('./dependencies/aprilFoolDictionary');
const {isAprilFoolsDay} = require('./dependencies/_isAprilFoolsDay');

module.exports = {
    name: isAprilFoolsDay() ? 'loot' : null,
    description: '🐟🐟🐟',
    guildOnly: true,
    creatorOnly: !isAprilFoolsDay(),
    cooldown: 60,
    execute(message) {

        const rngOtter = getRandomInt(ottersArray.length);
        const rngAdjective = getRandomInt(dictionary.length);
        const embed = new Discord.MessageEmbed()
            .setTitle(`Une loutre !`)
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/whatsapp/238/fish_1f41f.png')
            .addField(`Description`, `C'est un animal très ${dictionary[rngAdjective]} !`)
            .setImage(ottersArray[rngOtter]);

        message.reply('a trouvé une loutre ! Attendez... quoi ??')
            .then(message.reply(embed));
    }
};