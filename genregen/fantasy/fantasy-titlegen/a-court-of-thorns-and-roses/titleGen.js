'use strict';

const Util = require('../../../../util.js');

const _ = require('lodash');

// Generates titles for hypothetical books
// Format like: 'A Court of Thorns & Roses' by Sarah J Maas
class TitleGen {
    constructor () {
        const ARTICLES = `
            a
            the
        `;

        const SUBJECTS = `
            court
            house
            empire
            kingdom
            cult
            clan

            palace
            city
            castle
            tower
            tomb
            prison
            chapel
            vault
            temple

            king
            queen
            empress
            princess
            prince
            lady
            lord
            daughters
            sons
            girl
            boy
            child
            children
            legion
            champion
            knight
            merchant
            master
            weaver

            god 
            goddess

            lake
            river
            oasis
            sea
            ocean
            isle
            island
            land
            world
            mountain
            forest

            tree

            sword
            book
            catalogue
            throne

            path
            life
            riddle
            essense
            marriage
            wisdom
            knowledge
            game
            gauntlet
            tournament
            dance
            music
            constancy
            immutability
            tragedy
            triumph
            glory
            war
            battle
            fall
            conquest
            story
            myth
            legend
            creation
            birthplace
            banquet

            rage
            wrath
            agony
            ecstasy
            sorrow
            terror
            mercy
            grace
            love
            fury
            beauty

            night
            day
            season
            age
            time
        `;

        const NOUNS = `
            ruin
            marvels
            wonders
            mysteries
            beauty
            fortune
            omens
            dreams
            danger
            perils
            death
            vengeance

            wings
            feathers
            fingers
            teeth
            claws
            horns
            antlers
            bone
            ivory
            skulls
            skeletons
            eyes
            heartbeats
            blood
            tears
            shit

            flowers
            thorns
            leaves
            branches
            brambles
            bark
            wood
            ebony
            mahogany
            grass
            nectar
            roses
            wheat
            dates
            pomegranates
            strawberries
            raspberries
            spice
            salt
            ash
            oak
            feasts
            honey
            eggs

            wax
            silk
            cotton
            linen
            lace
            plaster
            sandpaper
            paper

            spiders
            scorpions
            salamanders
            snakes
            dragons
            birds
            ravens
            crows
            doves
            eagles
            monsters
            beasts

            lions
            wolves
            bears
            elephants
            whales
            cats
            dogs
            horses

            silver
            gold
            bronze
            brass
            steel
            iron
            stone
            marble
            mercury

            jewels
            gems
            diamonds
            emeralds
            sapphires
            rubies
            amber
            pearls
            opal

            hills
            battlements
            spires

            daggers
            knives
            scimitars
            spears
            arms
            poison
            venom
            arrows
            crossbows
            needles
            thimbles
            veils
            crowns
            gloves
            chains
            manacles

            keys
            locks
            doors
            windows
            candles
            lanterns
            hallways
            tunnels
            stairs
            shrines
            statues
            mirrors

            flames
            fire
            water
            soil
            air

            light
            shadow
            darkness
            void
            twilight
            dawn
            dusk
            starlight

            sky
            ice
            glaciers
            snow
            frost
            mist
            clouds
            thunder
            lightning
            storms
            hurricanes
            earthquakes

            spells

            song
            whispers
            screams
            wails
            sounds
            silence
            perfume

            secrets
            lies
            truth
            promises
            words
            kisses

            hopes
            desire
            memories
            horror
            terror
            fear
            mercy
            grace
            love
            hatred
            fury
            sorrow
            rage
            wrath
            glory

            guilds

            emperors
            sisters
            brothers
            wives
            lovers
            thieves
            corpses
            mortals
            killers

            witches
            wizards
            mages
            sorcerers
            alchemists
            giants
            titans
            elves
            ghosts
            wraiths
            demons
            devils
            angels
        `;

        const FIRST_ONLY = `
            breath
        `;

        const SECOND_ONLY = `
            damnation
            despair
        `;

        const UNUSED = `
            keep
            fort
            the lost
            the forgotten
            the damned
        `;

        const nouns = this.cleanArray(NOUNS);
        const firstOnlyNouns = this.cleanArray(FIRST_ONLY);
        const secondOnlyNouns = this.cleanArray(SECOND_ONLY);

        TitleGen.articles = this.cleanArray(ARTICLES);
        TitleGen.subjects = this.cleanArray(SUBJECTS);
        TitleGen.firstNouns = nouns.concat(firstOnlyNouns);
        TitleGen.secondNouns = nouns.concat(secondOnlyNouns);
    }

    next () {
        const article = _.sample(TitleGen.articles);
        const subject = _.sample(TitleGen.subjects);
        const noun1 = _.sample(TitleGen.firstNouns);

        // console.log(`noun1 is ${noun1}`)

        let noun2;
        do {
            // console.log(`noun2 is ${noun2}`)
            noun2 = _.sample(TitleGen.secondNouns);
        }
        while ([subject, noun1].includes(noun2));

        return `${article} ${subject} of ${noun1} & ${noun2}`;
    }

    cleanArray (rawStr) {
        return rawStr.trim()
            .split('\n')
            .map(
                s => Util.capitalized(s.trim())
            )
            .filter(
                s => s
            );
    }

    static test () {
        const gen = new TitleGen();

        console.log();
        console.log('  ' + gen.next());
        console.log();
    }
}

module.export = TitleGen;

TitleGen.test();





