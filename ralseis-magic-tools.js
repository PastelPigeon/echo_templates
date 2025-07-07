(function (Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('该扩展必须在非沙盒模式下运行');
  }

  const vm = Scratch.vm;

  const iconURIs = {
    getGlyphData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAATdJREFUaEPtmTESgjAQRaGm8RqewTt4BXsrO1taOyt7r+AdPIPXsEmtI+MW7hh2NxtCsoQOkpC8//kbBtrGyNEa4WgqSG5OzuZI121eHzGcuw9rwOdSoSoIKAZKShXE/cGZ0PuoHSkWJNbCKeWlDokdKR4kFUBodtiOVBAqDEQ7NyvLcWSuR0qaFdKRCqLMRnUEK5DLI8V1xpuRxYHsDqdBtOv5+COe77o2Or59Re2IORBQGpwBQHw9e0eKBcGKS5XGmeKOj54RcyBdv+aKOdrP9Y+/1W/yfQQcKR5k/7xFcQLf5LLajjv3/Q6GOwXvI2ZAQBEMRCnqE4AaB/NFr1rmQABIGn5ulZq8auEJsgWBhWpf56UZokqhOCNmQfB/DEo5bbv0vwn7K0rxIFplU40nHUm1EO08by4C7imDTKO6AAAAAElFTkSuQmCC",
    getCostumeIndex: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAe1JREFUaEPlmD1OAzEQhbPdcgJajkJJT0WFECUXQKKORIkEKRGioqKn5Ci0nIDtEsnKgPY5jzfj/Ch2aKKsB2fefJ4fbzfZ9N/J8Ty05dd3F7InxhvZZLR3dUKIw/c/56EA3x69j+0LCZUT2Vsh5hiLCDgejbwX0y+hIJk/Is0JIaHbFgFGKkomJ9KKkF1HXuWOl0xGpH4hFppl0itBFillpyKu1uNEmhMCguwrRt5LxGu3Lhne2UUD9Drotdu6EJYDOCMpO5VLSrDKFUlEOciOnj1XDnrttJDC4S+bWuFsRHNKCT4gIYVlVyWnWldHlhGdkKk43NnVkVICSnNKHy38ZedVdbj+9Pqc7Prn05X2XjIHLEQQipJg2BghtDdicSLNCoGqhkTeZkOyuLjp0yd+V4n08PSYTNSksD6RZoSQKhbNFcsJ/D97rqoX6x8WZ/1eq3oh5KZY2hAZCdUgcajUnZ1UKzoqqCyG9d0LCd7ZUc/L8PGvxKv+bLSu7im4GateeY5UL8QpgEaIcDBC1meiMxfDi2TC0291QtSNjQm6nE/T0mt3lz5ZkqOdyhXmjz2nRKoXoqZPbznGiNu+7Dn2E0UA/ZRv43GM3n8hpCGyqpHdE5aGVqWsXxgB28dyB+0YEdb5ccKQ77VqEbIAS9/hfH/LcSkAAAAASUVORK5CYII=",
    addGradient: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAa1JREFUaEPtWMuNwjAQdYqgjz3sgSboAFFDtIUgakB0QBMcOGwfW0RWGA04g8fzyWS1NskFIXtsv/f8Zibpgv8z3JbcXPdx5fPnF+zQ+W/1XHGOxasHMgKA2Z9bGU9FFiAe3lkUSVgsXqm/8oqHItUBiQemHqgb3H1Pshc11USuJqgtIMD8z+k7Mno5HOOvVpF1v4txq+2HSwegVqQ5IHDBQRlglvMINX9q5TcrUgOQrKmlHuAU4catWS2nSPVAVIWtULFHQ/i9ZKqylJdSRZoBAkyqAAnudFYhzis4mUC9CiFkExTpEekV+PdAgBGowFIGE+ayIQ7r6RRpAcjIK8CglGmveZjIy+FYLN6lwWj6FoBEUtb9LgLimJZ6SDsvIdKsSBtApErgNC1Nx9o4ThlSrrcBkvm2O3pTpJSxxs2miPVA1jh3INRBhuHe/Xfd/bZSLQ4ohedDNqPW5+qK2iPVAOFMrgUCCuC42RWpHggHAFdkq2mtcXh/bP6HR5oBkmQFVW+lrdA4O8F/aUdApeGXrGVVRnsgKwFiIJnutPjxWtvNTpg/rfsNIVQB5Bfa65w4jZiUNwAAAABJRU5ErkJggg==",
    getScriptType: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAoCAYAAAC8cqlMAAAAAXNSR0IArs4c6QAAAkdJREFUaEPtmD1LA0EQhvf+gYW9YOz8wEKwEawEwU4ULIKNhdpLTCMiNjHYq4WNpBAUO0GwEmwEC/GjM4K9hf/gJHt5JTvu7GzOi7k7c1Wyu7d77zw7s7MTKP4JG12ve4eOIUoNba6hP2j+0O95PMb4GOsYS2Ay27q5EQJxhoWp5VqI6PEf4bUHDKX6gxljnDSvUspldHenbatIC6ZZiEEGQkDC98MlTCBE55dIUAeV1mn0Gz6TeSFQnBQJakHqOx0jknshn9W61thXKvhsU3ZM14lkTgjnGxBCTR2XUAsZ5/kRO2rlVghHQnIUidSfE8mSEH0QSluK5lxcNsuN4wj5kvFxpMwJcd4jOCKwWBiar9erR1Y3KZRWzXtEENlSmt/hc3qCViL5EsLtbWkPg0jQtLDkI3S85IOUCL2Z/iDy74TQnOi3RLhklAvviRFJsxDjJjgxPKX/Xz1vOw9pWAzRqF0fQXSTTvrZkR39Hfcvt9b0ynaO6OiVByEGGekmyKYo+2U7yY2KtV0iIp3wYl2rJ6Rpd0QXqZKYXiI9IXbX6p6PpIiINXrdPQ3q9snRN8N00gnsm/rQ+SUS7dzZjftI5oVcPkZ1KzwSEUQrKQej0QqGwjpzY991smSq8bkRgoORWgxkkAudLheduRk6l05qRi7HzdtxH6FbLM1CnEUHakEI212Z1z9rC+tWMsXzA92+dXxh7ae+h0ESmdi5VpaEeGXBtIpSfo9eu1kct1p8+uxBt1cGom7cXzyqKMlELWkhhNluCfkCk8fkOIfQwpYAAAAASUVORK5CYII="
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
          {
            opcode: 'getScriptType',
            blockType: Scratch.BlockType.REPORTER,
            text: '判断字符[CHAR]的书写系统',
            blockIconURI: iconURIs.getScriptType,
            arguments: {
              CHAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'A'
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

    getScriptType(args) {
      const char = Scratch.Cast.toString(args.CHAR);
      if (!char) return '未知';
      
      // 只取第一个字符进行判断
      const firstChar = char.charAt(0);
      const code = firstChar.charCodeAt(0);
      
      // 判断字符所属的书写系统
      if (this.isChinese(firstChar)) {
        return '中文';
      } else if (this.isJapanese(firstChar)) {
        return '日文';
      } else if (this.isKorean(firstChar)) {
        return '韩文';
      } else if (this.isCyrillic(firstChar)) {
        return '西里尔文';
      } else if (this.isArabic(firstChar)) {
        return '阿拉伯文';
      } else if (this.isDevanagari(firstChar)) {
        return '梵文';
      } else if (this.isLatin(firstChar)) {
        return '英文/拉丁文';
      } else if (this.isEmoji(firstChar)) {
        return '表情符号';
      } else if (this.isDigit(firstChar)) {
        return '数字';
      } else if (this.isSymbol(firstChar)) {
        return '符号';
      } else {
        return '其他';
      }
    }
    
    // 判断字符是否为中文
    isChinese(char) {
      const code = char.charCodeAt(0);
      // 基本汉字 (4E00-9FFF)
      if (code >= 0x4E00 && code <= 0x9FFF) return true;
      // 扩展A区 (3400-4DBF)
      if (code >= 0x3400 && code <= 0x4DBF) return true;
      // 扩展B区 (20000-2A6DF)
      if (code >= 0x20000 && code <= 0x2A6DF) return true;
      // 扩展C区 (2A700–2B73F)
      if (code >= 0x2A700 && code <= 0x2B73F) return true;
      // 扩展D区 (2B740–2B81F)
      if (code >= 0x2B740 && code <= 0x2B81F) return true;
      // 扩展E区 (2B820–2CEAF)
      if (code >= 0x2B820 && code <= 0x2CEAF) return true;
      // 扩展F区 (2CEB0–2EBEF)
      if (code >= 0x2CEB0 && code <= 0x2EBEF) return true;
      
      return false;
    }
    
    // 判断字符是否为日文
    isJapanese(char) {
      const code = char.charCodeAt(0);
      // 平假名 (3040-309F)
      if (code >= 0x3040 && code <= 0x309F) return true;
      // 片假名 (30A0-30FF)
      if (code >= 0x30A0 && code <= 0x30FF) return true;
      // 日文汉字 (4E00-9FAF) - 与中文重叠
      if (code >= 0x4E00 && code <= 0x9FAF) return true;
      // 日文标点符号 (3000-303F)
      if (code >= 0x3000 && code <= 0x303F) return true;
      
      return false;
    }
    
    // 判断字符是否为韩文
    isKorean(char) {
      const code = char.charCodeAt(0);
      // 韩文字母 (AC00-D7AF)
      if (code >= 0xAC00 && code <= 0xD7AF) return true;
      // 韩文兼容字母 (3130-318F)
      if (code >= 0x3130 && code <= 0x318F) return true;
      return false;
    }
    
    // 判断字符是否为拉丁文（英文）
    isLatin(char) {
      const code = char.charCodeAt(0);
      // 基本拉丁字母 (A-Z, a-z)
      if ((code >= 0x0041 && code <= 0x005A) || 
          (code >= 0x0061 && code <= 0x007A)) return true;
      return false;
    }
    
    // 判断字符是否为西里尔文
    isCyrillic(char) {
      const code = char.charCodeAt(0);
      // 西里尔字母 (0400-04FF)
      if (code >= 0x0400 && code <= 0x04FF) return true;
      return false;
    }
    
    // 判断字符是否为阿拉伯文
    isArabic(char) {
      const code = char.charCodeAt(0);
      // 阿拉伯字母 (0600-06FF)
      if (code >= 0x0600 && code <= 0x06FF) return true;
      return false;
    }
    
    // 判断字符是否为梵文
    isDevanagari(char) {
      const code = char.charCodeAt(0);
      // 梵文字母 (0900-097F)
      if (code >= 0x0900 && code <= 0x097F) return true;
      return false;
    }
    
    // 判断字符是否为表情符号
    isEmoji(char) {
      const code = char.charCodeAt(0);
      // 表情符号范围 (1F300-1F5FF, 1F600-1F64F, 1F900-1F9FF)
      if ((code >= 0x1F300 && code <= 0x1F5FF) ||
          (code >= 0x1F600 && code <= 0x1F64F) ||
          (code >= 0x1F900 && code <= 0x1F9FF)) return true;
      return false;
    }
    
    // 判断字符是否为数字
    isDigit(char) {
      const code = char.charCodeAt(0);
      // 数字 (0-9)
      if (code >= 0x0030 && code <= 0x0039) return true;
      return false;
    }
    
    // 判断字符是否为符号
    isSymbol(char) {
      const code = char.charCodeAt(0);
      // 基本标点符号 (2000-206F)
      if (code >= 0x2000 && code <= 0x206F) return true;
      // 通用标点符号 (2000-206F)
      if (code >= 0x2000 && code <= 0x206F) return true;
      return false;
    }
  }
  
  Scratch.extensions.register(new RalseiMagicTools());
})(Scratch);