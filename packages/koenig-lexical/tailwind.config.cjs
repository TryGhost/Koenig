module.exports = {
    corePlugins: {
        preflight: false // we're providing our own scoped CSS reset
    },
    important: '.koenig-lexical',
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './demo/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: 'class',
    theme: {
        colors: {
            accent: 'var(--kg-accent-color, #ff0095)',
            transparent: 'transparent',
            current: 'currentColor',
            white: '#FFF',
            black: '#15171A',
            grey: {
                DEFAULT: '#ABB4BE',
                50: '#FAFAFB',
                75: '#F9FAFB',
                100: '#F4F5F6',
                150: '#F1F3F4',
                200: '#EBEEF0',
                250: '#E5E9ED',
                300: '#DDE1E5',
                400: '#CED4D9',
                500: '#AEB7C1',
                600: '#95A1AD',
                700: '#7C8B9A',
                800: '#626D79',
                900: '#394047',
                925: '#2E3338',
                950: '#23292F',
                975: '#191B1E'
            },
            green: {
                DEFAULT: '#30CF43',
                100: '#E1F9E4',
                400: '#58DA67',
                500: '#30CF43',
                600: '#2AB23A'
            },
            blue: {
                DEFAULT: '#14B8FF',
                100: '#DBF4FF',
                400: '#42C6FF',
                500: '#14B8FF',
                600: '#00A4EB'
            },
            purple: {
                DEFAULT: '#8E42FF',
                100: '#EDE0FF',
                400: '#A366FF',
                500: '#8E42FF',
                600: '7B1FFF'
            },
            pink: {
                DEFAULT: '#FB2D8D',
                100: '#FFDFEE',
                400: '#FF5CA8',
                500: '#FB2D8D',
                600: '#F70878'
            },
            red: {
                DEFAULT: '#F50B23',
                100: '#FFE0E0',
                400: '#F9394C',
                500: '#F50B23',
                600: '#DC091E'
            },
            yellow: {
                DEFAULT: '#FFB41F',
                100: '#FFF1D6',
                400: '#FFC247',
                500: '#FFB41F',
                600: '#F0A000'
            },
            lime: {
                DEFAULT: '#B5FF18',
                300: '#CFFF99',
                500: '#B5FF18',
                800: '#466600',
                900: '#344D00'
            }
        },
        fontFamily: {
            sans: 'Inter, -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica, ubuntu, roboto, noto, segoe ui, arial, sans-serif',
            serif: 'Georgia, Times, serif',
            mono: 'Consolas, Liberation Mono, Menlo, Courier, monospace'
        },
        boxShadow: {
            DEFAULT: '0 0 1px rgba(0,0,0,.15), 0px 13px 27px -5px rgba(50, 50, 93, 0.08), 0px 8px 16px -8px rgba(0, 0, 0, 0.12)',
            sm: '0px 2px 5px -1px rgba(50, 50, 93, 0.2), 0px 1px 3px -1px rgba(0, 0, 0, 0.25)',
            md: '0px 13px 27px -5px rgba(50, 50, 93, 0.25), 0px 8px 16px -8px rgba(0, 0, 0, 0.3)',
            lg: '0px 50px 100px -25px rgba(50, 50, 93, 0.2), 0px 30px 60px -20px rgba(0, 0, 0, 0.25)',
            xl: '0 2.8px 2.2px rgba(0, 0, 0, 0.02), 0 6.7px 5.3px rgba(0, 0, 0, 0.028), 0 12.5px 10px rgba(0, 0, 0, 0.035), 0 22.3px 17.9px rgba(0, 0, 0, 0.042), 0 41.8px 33.4px rgba(0, 0, 0, 0.05), 0 100px 80px rgba(0, 0, 0, 0.07)',
            inner: 'inset 0 0 4px 0 rgb(0 0 0 / 0.08)',
            insetgreen: '0px 0px 0px 1px inset var(--green)',
            none: '0 0 #0000'
        },
        extend: {
            spacing: {
                px: '1px',
                0: '0px',
                0.5: '0.2rem',
                1: '0.4rem',
                1.5: '0.6rem',
                2: '0.8rem',
                2.5: '1rem',
                3: '1.2rem',
                3.5: '1.4rem',
                4: '1.6rem',
                5: '2rem',
                6: '2.4rem',
                7: '2.8rem',
                8: '3.2rem',
                9: '3.6rem',
                10: '4rem',
                11: '4.4rem',
                12: '4.8rem',
                14: '5.6rem',
                16: '6.4rem',
                20: '8rem',
                24: '9.6rem',
                28: '11.2rem',
                32: '12.8rem',
                36: '14.4rem',
                40: '16rem',
                44: '17.6rem',
                48: '19.2rem',
                52: '20.8rem',
                56: '22.4rem',
                60: '24rem',
                64: '25.6rem',
                72: '28.8rem',
                80: '32rem',
                96: '38.4rem'
            },
            maxWidth: {
                none: 'none',
                0: '0rem',
                xs: '32rem',
                sm: '38.4rem',
                md: '44.8rem',
                lg: '51.2rem',
                xl: '57.6rem',
                '2xl': '67.2rem',
                '3xl': '76.8rem',
                '4xl': '89.6rem',
                '5xl': '102.4rem',
                '6xl': '115.2rem',
                '7xl': '128rem',
                '8xl': '140rem',
                '9xl': '156rem',
                full: '100%',
                min: 'min-content',
                max: 'max-content',
                fit: 'fit-content',
                prose: '65ch'
            },
            borderRadius: {
                sm: '0.2rem',
                DEFAULT: '0.4rem',
                md: '0.6rem',
                lg: '0.8rem',
                xl: '1.2rem',
                '2xl': '1.6rem',
                '3xl': '2.4rem',
                full: '9999px'
            },
            fontSize: {
                '2xs': '1.2rem',
                xs: '1.25rem',
                sm: '1.4rem',
                md: '1.5rem',
                lg: '1.8rem',
                xl: '2rem',
                '2xl': '2.4rem',
                '3xl': '3rem',
                '4xl': '3.6rem',
                '5xl': ['4.8rem', '1.15'],
                '6xl': ['6rem', '1'],
                '7xl': ['7.2rem', '1'],
                '8xl': ['9.6rem', '1'],
                '9xl': ['12.8rem', '1']
            },
            screens: {
                xs: '500px'
            }
        }
    },
    plugins: []
};
