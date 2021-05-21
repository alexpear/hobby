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
            fall
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
            wives
            lovers
            friends
            enemies
            rivals
            peers

            emperors
            sultans
            sailors
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

    static test () {
        const gen = new TitleGen();

        console.log();
        console.log('  ' + gen.next());
        console.log();
    }
}

module.export = TitleGen;

TitleGen.test();





