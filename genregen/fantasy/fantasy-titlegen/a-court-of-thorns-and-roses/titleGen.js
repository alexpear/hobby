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
            peerage
            college
            university
            pedigree
            inheritance
            gift

            palace
            garden
            city
            castle
            fortress
            tower
            tomb
            prison
            chapel
            vault
            staircase
            room
            chamber
            temple
            labyrinth

            king
            queen
            empress
            caliph
            princess
            prince
            lady
            lord
            tyrant
            daughter
            son
            girl
            boy
            child
            legion

            champion
            knight
            warrior
            conqueror
            merchant
            master
            oracle
            weaver
            servant
            worshiper
            acolyte
            mastermind

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
            planet
            universe
            mountain
            forest

            tree

            sword
            book
            catalogue
            throne

            path
            road
            life
            lifetime
            tyranny
            riddle
            interrogation
            aspect
            marriage
            wedding
            wedlock
            bride
            husband
            wisdom
            knowledge
            game
            gauntlet
            test
            tournament
            dance
            music

            tragedy
            comedy
            fate
            curse
            plague
            triumph
            war
            battle
            conquest
            rescue
            harvest
            history
            story
            theatre
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
            doom
            dreams
            danger
            perils
            death
            vengeance

            wings
            feathers
            fur
            fingers
            teeth
            claws
            talons
            fangs 
            hooves
            horns
            antlers
            bone
            ivory
            skulls
            skeletons
            eyes
            hearts
            heartbeats
            blood
            tears
            shit

            flowers
            thorns
            leaves
            branches
            brambles
            briars
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
            spiderwebs
            cobwebs
            cotton
            linen
            lace
            plaster
            sandpaper
            paper

            spiders
            scorpions
            sharks
            leeches
            salamanders
            newts
            snakes
            serpents
            dragons
            birds
            songbirds
            ravens
            crows
            doves
            eagles
            falcons
            hawks

            lions
            wolves
            bears
            elephants
            whales
            cats
            dogs
            horses
            asses
            apes

            monsters
            beasts
            gargoyles
            spirits
            ghosts
            souls
            wraiths
            phantoms
            demons
            devils
            angels

            silver
            gold
            bronze
            brass
            steel
            iron
            stone
            marble
            crystal
            quicksilver

            jewels
            gems
            diamonds
            emeralds
            sapphires
            rubies
            amethyst
            amber
            pearls
            jade
            opal
            treasure

            hills
            precipices
            caverns
            spires
            ships
            galleons
            sails

            daggers
            knives
            blades
            scimitars
            scythes
            spears
            arms
            fists
            poison
            potions
            venom
            arrows
            crossbows
            needles
            thimbles
            veils
            earrings
            brooches
            crowns
            gloves
            chains
            manacles

            coins
            keys
            locks
            doors
            windows
            battlements
            candles
            rope
            lanterns
            trumpets
            kettle-drums
            violins
            hallways
            alleys
            tunnels
            streets
            shrines
            fountains
            statues
            mirrors
            puppets

            flames
            fire
            water
            tides
            soil
            air
            wind

            light
            shadow
            darkness
            oblivion
            void
            twilight
            dawn
            dusk
            starlight
            moonlight
            stars 

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
            vortices
            earthquakes

            spells

            song
            ballad
            whispers
            screams
            wails
            howling
            sounds
            silence
            perfume

            secrets
            lies
            treachery
            treason
            truth
            promises
            cruelty
            valor
            honor
            flattery
            words
            questions
            symbols
            footprints
            kisses

            constancy
            immutability
            invisibility

            hopes
            desire
            intellect
            memories
            horror
            terror
            fear
            dread
            madness
            love
            hatred
            malice
            fury
            sorrow
            rage
            wrath

            glory
            piety
            dignity
            honesty
            confusion
            mercy
            grace
            sin
            transgression
            arson
            murder
            service

            guilds

            sisters
            brothers
            lovers
            friends
            enemies
            rivals
            peers

            emperors
            sultans
            sailors
            soldiers
            archers
            thieves
            corpses
            mortals
            killers
            wanderers
            scavengers
            marauders
            criminals
            sinners
            nobility
            heroes

            witches
            wizards
            mages
            sorcerers
            alchemists
            vampires
            giants
            titans
            goblins
            mermaids
            gremlins
            elves
        `;

        const FIRST_ONLY = `
            breath
        `;

        const SECOND_ONLY = `
            damnation
            the Lost
            the Forgotten
            the Damned
            the Dead
            despair
            evil
            annihilation
        `;

        const UNUSED = `
            springtime
            summer
            autumn
            winter
            keep
            fort
            clash
            nature
            essense
            clues
            gate
            quest
            voyage
            journey
            crusade
            ministry
            pyramids
            cubes
            sphere
            wives
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
        let article = _.sample(TitleGen.articles);
        const subject = _.sample(TitleGen.subjects);
        const noun1 = _.sample(TitleGen.firstNouns);

        if (article === 'A' && 'AEIOU'.includes(subject[0])) {
            article = 'An';
        }

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
                s => {
                    s = s.trim();
                    if (s.includes(' ')) {
                        if (s.startsWith('the ')) {
                            // 'the' phrases need to do their own capitalization currently.
                            return s;
                        }
                    }

                    return Util.capitalized(s.trim())
                }
            )
            .filter(
                s => s
            );
    }

    printFancyNext () {
        console.log(`  ${this.next()}\n`);
    }

    /* LATER: Could print vertically with centered text, like a book cover:

             a
           CHILD
            of 
           OMENS
             &
         STARLIGHT

            the
         WORSHIPER
            of 
           OMENS
             &
           ANGELS

            the
           ORACLE
             of
           FLAMES
             &
            FUR

        The
        ORACLE
        of
        FLAMES
        &
        FUR

        THE
        ORACLE
        OF
        FLAMES
        &
        FUR

        The
        Oracle
        of
        Flames
        &
        the
        Forgotten
    */

    printVertical () {
        const title = this.next();

        const lines = title.toUpperCase()
            .split(' ')
            .map(
                word => '  ' + word
            );

        lines[0] = lines[0].toLowerCase();
        lines[2] = lines[2].toLowerCase();

        console.log(lines.join('\n') + '\n');
    }

    static test () {
        console.log();

        const gen = new TitleGen();

        // for (let i = 0; i < 21; i++) {
        for (let i = 0; i < 5; i++) {
            gen.printVertical();
        }
    }
}

module.export = TitleGen;

TitleGen.test();

