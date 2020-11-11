const plugin = require('tailwindcss/plugin')

const nightwind = plugin(
  function({ addComponents, theme, variants, e, prefix }) {
        
    const darkSelector = theme('darkSelector', '.dark')

    const colorClasses = []
    const transitionClasses = []
    
    const colors = theme('colors')
    const colorVariants = variants('nightwind')
    const prefixes = ['text', 'bg', 'border', 'placeholder']
    const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900]

    Object.keys(colors).forEach(color => {
      prefixes.forEach(prefix => {
        if (color == 'white' || color == 'black') {
          let base = prefix+'-'+color
          colorClasses.push(base);

          colorVariants.forEach(variant => {
            if (variant == 'last') {
              let baseVar = prefix+'-'+color+'\\:'+variant
              colorClasses.push(baseVar);
            } else {
              let baseVar = variant+'\\:'+prefix+'-'+color
              colorClasses.push(baseVar);
            }
          })
        } else {
          return false
        }
      })
    })
    
    Object.keys(colors).forEach(color => {
      if (color == 'transparent' || color == 'current' || color == 'white' || color == 'black') {
        return false
      } else {
        prefixes.forEach(prefix => {
          weights.forEach(weight => {
            let base = prefix+'-'+color+'-'+weight
            colorClasses.push(base); 
              colorVariants.forEach(variant => {
                let baseVar = variant+'\\:'+prefix+'-'+color+'-'+weight
                colorClasses.push(baseVar);
            })
          })
        })   
      }
    })
    
    Object.keys(colors).forEach( color  => {
      prefixes.forEach(prefix => {
        if (color == 'transparent' || color == 'current' || color == 'white' || color == 'black') {
          const transitionClass = {
            [`.nightwind .${prefix}-${color}`]: {
              transitionDuration: theme('transitionDuration.nightwind'), 
              transitionProperty: theme('transitionProperty.colors')
            },
            [`.nightwind .dark\\:${prefix}-${color}`]: {
              transitionDuration: theme('transitionDuration.nightwind'), 
              transitionProperty: theme('transitionProperty.colors')
            }
          }
          transitionClasses.push(transitionClass)
        } else {
          weights.forEach( weight => {
            const transitionClass = {
              [`.nightwind .${prefix}-${color}-${weight}`]: {
                transitionDuration: theme('transitionDuration.nightwind'), 
                transitionProperty: theme('transitionProperty.colors')
              },
              [`.nightwind .dark\\:${prefix}-${color}-${weight}`]: {
                transitionDuration: theme('transitionDuration.nightwind'), 
                transitionProperty: theme('transitionProperty.colors')
              }
            }
            transitionClasses.push(transitionClass)
          })
        }
      })
    })

    const nightwindClasses = colorClasses.map((colorClass) => {
      let pseudoVariant = ''

      colorVariants.forEach(variant => {
        if (colorClass.includes(variant)) { pseudoVariant = variant }
      })

      if ( colorClass.includes('white') || colorClass.includes('black') ) {
        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: colorClass.includes('white') ? theme('colors.black') : theme('colors.white')
            }
          }
        }
      } else {
        const getColor = colorClass.split('-')[1]
        const invertWeight = String(1000 - Number(colorClass.slice(-3)))

        if (colorClass.includes('text-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              color: theme(`colors.${getColor}.${invertWeight}`)
            }
          }  
        }
        else if (colorClass.includes('bg-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              backgroundColor: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        } else if (colorClass.includes('border-')) {
          return {
            [`${darkSelector} .${colorClass}${pseudoVariant ? `:${pseudoVariant}` : ''}`]: {
              borderColor: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        } else if (colorClass.includes('placeholder-')) {
          return {
            [`${darkSelector} .${colorClass}::placeholder`]: {
              color: theme(`colors.${getColor}.${invertWeight}`)
            }
          }
        }
      }
    })

    addComponents(nightwindClasses, { variants: ['responsive'] });
    addComponents(transitionClasses, { variants: ['responsive'] });
  },
  {
    theme: {
      extend: {
        transitionDuration: {
          '0': '0ms',
          'nightwind': '300ms'
        }
      }
    }
  },
  {
    purge: [
      './node_modules/nightwind/**/*.js',
      './node_modules/nightwind/**/*.jsx',
    ],
  }
);

module.exports = nightwind