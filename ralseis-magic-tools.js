(function (Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('该扩展必须在非沙盒模式下运行');
  }

  const vm = Scratch.vm;

  const iconURIs = {
    getGlyphData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAATdJREFUaEPtmTESgjAQRaGm8RqewTt4BXsrO1taOyt7r+AdPIPXsEmtI+MW7hh2NxtCsoQOkpC8//kbBtrGyNEa4WgqSG5OzuZI121eHzGcuw9rwOdSoSoIKAZKShXE/cGZ0PuoHSkWJNbCKeWlDokdKR4kFUBodtiOVBAqDEQ7NyvLcWSuR0qaFdKRCqLMRnUEK5DLI8V1xpuRxYHsDqdBtOv5+COe77o2Or59Re2IORBQGpwBQHw9e0eKBcGKS5XGmeKOj54RcyBdv+aKOdrP9Y+/1W/yfQQcKR5k/7xFcQLf5LLajjv3/Q6GOwXvI2ZAQBEMRCnqE4AaB/NFr1rmQABIGn5ulZq8auEJsgWBhWpf56UZokqhOCNmQfB/DEo5bbv0vwn7K0rxIFplU40nHUm1EO08by4C7imDTKO6AAAAAElFTkSuQmCC",
    getCostumeIndex: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAe1JREFUaEPlmD1OAzEQhbPdcgJajkJJT0WFECUXQKKORIkEKRGioqKn5Ci0nIDtEsnKgPY5jzfj/Ch2aKKsB2fefJ4fbzfZ9N/J8Ty05dd3F7InxhvZZLR3dUKIw/c/56EA3x69j+0LCZUT2Vsh5hiLCDgejbwX0y+hIJk/Is0JIaHbFgFGKkomJ9KKkF1HXuWOl0xGpH4hFppl0itBFillpyKu1uNEmhMCguwrRt5LxGu3Lhne2UUD9Drotdu6EJYDOCMpO5VLSrDKFUlEOciOnj1XDnrttJDC4S+bWuFsRHNKCT4gIYVlVyWnWldHlhGdkKk43NnVkVICSnNKHy38ZedVdbj+9Pqc7Prn05X2XjIHLEQQipJg2BghtDdicSLNCoGqhkTeZkOyuLjp0yd+V4n08PSYTNSksD6RZoSQKhbNFcsJ/D97rqoX6x8WZ/1eq3oh5KZY2hAZCdUgcajUnZ1UKzoqqCyG9d0LCd7ZUc/L8PGvxKv+bLSu7im4GateeY5UL8QpgEaIcDBC1meiMxfDi2TC0291QtSNjQm6nE/T0mt3lz5ZkqOdyhXmjz2nRKoXoqZPbznGiNu+7Dn2E0UA/ZRv43GM3n8hpCGyqpHdE5aGVqWsXxgB28dyB+0YEdb5ccKQ77VqEbIAS9/hfH/LcSkAAAAASUVORK5CYII=",
    addGradient: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAa1JREFUaEPtWMuNwjAQdYqgjz3sgSboAFFDtIUgakB0QBMcOGwfW0RWGA04g8fzyWS1NskFIXtsv/f8Zibpgv8z3JbcXPdx5fPnF+zQ+W/1XHGOxasHMgKA2Z9bGU9FFiAe3lkUSVgsXqm/8oqHItUBiQemHqgb3H1Pshc11USuJqgtIMD8z+k7Mno5HOOvVpF1v4txq+2HSwegVqQ5IHDBQRlglvMINX9q5TcrUgOQrKmlHuAU4catWS2nSPVAVIWtULFHQ/i9ZKqylJdSRZoBAkyqAAnudFYhzis4mUC9CiFkExTpEekV+PdAgBGowFIGE+ayIQ7r6RRpAcjIK8CglGmveZjIy+FYLN6lwWj6FoBEUtb9LgLimJZ6SDsvIdKsSBtApErgNC1Nx9o4ThlSrrcBkvm2O3pTpJSxxs2miPVA1jh3INRBhuHe/Xfd/bZSLQ4ohedDNqPW5+qK2iPVAOFMrgUCCuC42RWpHggHAFdkq2mtcXh/bP6HR5oBkmQFVW+lrdA4O8F/aUdApeGXrGVVRnsgKwFiIJnutPjxWtvNTpg/rfsNIVQB5Bfa65w4jZiUNwAAAABJRU5ErkJggg=="
  }
  
  class RalseiMagicTools {
    getInfo() {
      return {
        id: 'ralsemagictools',
        name: 'Ralsei的魔法工具',
        color1: '#00c5ff',
        color2: '#00a3ff',
        blocks: [
          {
            opcode: 'getGlyphData',
            blockType: Scratch.BlockType.REPORTER,
            text: '获取字符[CHAR]的字形数据，颜色[COLOR]，大小[SIZE]px，字体数据[FONTSVGDATA]',
            blockIconURI: iconURIs.getGlyphData,
            arguments: {
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'A'
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#000000'
              },
              SIZE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
              },
              FONTSVGDATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<font><glyph unicode="A" d="M100 0L200 300L0 300Z"/></font>'
              }
            }
          },
          {
            opcode: 'getCostumeIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: '名为[COSTUME]的造型在[TARGET]角色中的编号',
            blockIconURI: iconURIs.getCostumeIndex,
            arguments: {
              COSTUME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '造型1'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TARGET_MENU'
              }
            }
          },
          {
            opcode: 'addGradient',
            blockType: Scratch.BlockType.REPORTER,
            text: '为SVG添加渐变色，方向[DIR]，起始颜色[START], 结束颜色[END], SVG数据[SVGDATA]',
            blockIconURI: iconURIs.addGradient,
            arguments: {
              DIR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'DIRECTION_MENU'
              },
              START: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#FF0000'
              },
              END: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#0000FF'
              },
              SVGDATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<svg width="100" height="100"><rect width="100" height="100"/></svg>'
              }
            }
          },
          '---',
          {
            opcode: 'getCurrentTarget',
            blockType: Scratch.BlockType.REPORTER,
            text: '当前角色',
            disableMonitor: true
          }
        ],
        menus: {
          TARGET_MENU: {
            acceptReporters: true,
            items: ['_stage_', '_this_', '_current_']
          },
          DIRECTION_MENU: {
            acceptReporters: false,
            items: ['上', '下', '左', '右', '左上', '右上', '左下', '右下']
          }
        }
      };
    }
    
    getCurrentTarget() {
      return '_current_';
    }
    
    getGlyphData(args) {
      const char = args.CHAR;
      const color = args.COLOR;
      const size = Number(args.SIZE) || 100;
      const fontData = args.FONTSVGDATA;
      
      if (!fontData || !char) {
        return '';
      }
      
      // 尝试解析字体数据
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fontData, 'text/xml');
      
      // 查找匹配的字符
      const glyphs = xmlDoc.getElementsByTagName('glyph');
      let glyphPath = '';
      
      for (let glyph of glyphs) {
        const unicode = glyph.getAttribute('unicode');
        if (unicode === char) {
          glyphPath = glyph.getAttribute('d') || '';
          break;
        }
      }
      
      if (!glyphPath) {
        return '';
      }
      
      // 创建SVG路径
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -200 1000 1000" width="${size}" height="${size}">
          <path d="${glyphPath}" fill="${color}" transform="scale(1 -1) translate(0 -800)"/>
        </svg>
      `;
      
      return svg;
    }
    
    getCostumeIndex(args) {
      const costumeName = Scratch.Cast.toString(args.COSTUME);
      const target = Scratch.Cast.toString(args.TARGET);
      
      let sprite;
      if (target === '_stage_') {
        sprite = vm.runtime.getTargetForStage();
      } else if (target === '_this_') {
        sprite = vm.runtime.getTargetForStage().getSprite();
      } else if (target === '_current_') {
        sprite = vm.runtime.getEditingTarget();
      } else {
        // 尝试通过名称查找角色
        const targets = vm.runtime.targets;
        for (let t of targets) {
          if (t.getName() === target) {
            sprite = t;
            break;
          }
        }
      }
      
      if (!sprite) {
        return 0;
      }
      
      const costumes = sprite.getCostumes();
      for (let i = 0; i < costumes.length; i++) {
        if (costumes[i].name === costumeName) {
          return i + 1; // Scratch中造型编号从1开始
        }
      }
      
      return 0; // 未找到
    }
    
    addGradient(args) {
      const direction = args.DIR;
      const startColor = args.START;
      const endColor = args.END;
      let svgData = args.SVGDATA;
      
      if (!svgData) {
        return '';
      }
      
      // 计算渐变方向
      let x1, y1, x2, y2;
      switch (direction) {
        case '上': x1 = '0%'; y1 = '100%'; x2 = '0%'; y2 = '0%'; break;
        case '下': x1 = '0%'; y1 = '0%'; x2 = '0%'; y2 = '100%'; break;
        case '左': x1 = '100%'; y1 = '0%'; x2 = '0%'; y2 = '0%'; break;
        case '右': x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '0%'; break;
        case '左上': x1 = '100%'; y1 = '100%'; x2 = '0%'; y2 = '0%'; break;
        case '右上': x1 = '0%'; y1 = '100%'; x2 = '100%'; y2 = '0%'; break;
        case '左下': x1 = '100%'; y1 = '0%'; x2 = '0%'; y2 = '100%'; break;
        case '右下': x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '100%'; break;
        default: x1 = '0%'; y1 = '0%'; x2 = '100%'; y2 = '100%'; // 默认右下
      }
      
      // 生成唯一ID避免冲突
      const gradientId = 'gradient_' + Math.random().toString(36).substr(2, 9);
      
      // 插入渐变定义
      const gradientDef = `
        <defs>
          <linearGradient id="${gradientId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
            <stop offset="0%" stop-color="${startColor}" />
            <stop offset="100%" stop-color="${endColor}" />
          </linearGradient>
        </defs>
      `;
      
      // 替换填充样式
      svgData = svgData
        .replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`)
        .replace(/fill="[^"]*"/g, `fill="url(#${gradientId})"`)
        .replace(/fill:\s*[^;"]*(;|")/g, `fill: url(#${gradientId})$1`);
      
      return svgData;
    }
  }
  
  Scratch.extensions.register(new RalseiMagicTools());
})(Scratch);