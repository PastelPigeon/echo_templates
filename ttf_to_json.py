#!/usr/bin/env python3
"""
TTF字体转换工具 - XML转义版
生成有效的SVG XML数据，确保特殊字符正确转义
作者: Ralsei魔法工具库
日期: 2023-07-07

功能:
1. 解析TTF字体文件
2. 按指定像素大小提取每个字符的字形数据
3. 生成完整的SVG标签并正确转义XML特殊字符
4. 调整字形位置，确保左下角位于原点(0,0)
5. 输出JSON格式的字体文件，所有尺寸以像素为单位

使用方法:
python ttf_to_json.py [输入字体.ttf] [输出文件名.json] [--size 字体大小(px)]
"""

import sys
import os
import json
import argparse
import traceback
import xml.sax.saxutils
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

def escape_xml(text):
    """转义XML特殊字符"""
    return xml.sax.saxutils.escape(text, entities={
        "'": "&apos;",
        "\"": "&quot;"
    })

def convert_ttf_to_json(input_file, output_file, font_size=16):
    """
    将TTF字体文件转换为JSON格式，生成有效XML的SVG标签
    
    参数:
        input_file: 输入的TTF字体文件路径
        output_file: 输出的JSON文件路径
        font_size: 字体大小(像素)
    """
    try:
        # 加载TTF字体文件
        font = TTFont(input_file)
        
        # 获取字体基本信息
        font_name = font['name'].getBestFullName() or os.path.basename(input_file).split('.')[0]
        units_per_em = font['head'].unitsPerEm
        ascent = font['hhea'].ascent
        descent = font['hhea'].descent
        
        # 计算缩放比例 (设计单位到像素)
        scale = font_size / units_per_em
        
        print(f"正在处理字体: {font_name}")
        print(f"Units per EM: {units_per_em}")
        print(f"字体大小: {font_size}px")
        print(f"缩放比例: {scale:.6f}")
        print(f"Ascent: {ascent} (设计单位) -> {ascent * scale:.2f}px")
        print(f"Descent: {descent} (设计单位) -> {descent * scale:.2f}px")
        
        # 获取字符映射表
        cmap = font.getBestCmap()
        print(f"找到 {len(cmap)} 个字符")
        
        # 准备存储字形数据
        glyphs = []
        missing_glyphs = []
        
        # 遍历所有字符
        for unicode_val, glyph_name in cmap.items():
            # 获取字形
            try:
                glyph = font['glyf'][glyph_name]
            except KeyError:
                print(f"无法找到字形: {glyph_name} (U+{unicode_val:04X})")
                missing_glyphs.append(f"U+{unicode_val:04X}")
                continue
            
            # 获取字形边界框
            if hasattr(glyph, 'xMin'):
                bbox = glyph.xMin, glyph.yMin, glyph.xMax, glyph.yMax
            else:
                # 对于空字形（如空格），使用默认边界框
                bbox = 0, 0, units_per_em // 2, 0
                print(f"空字形处理: U+{unicode_val:04X} ({glyph_name})")
            
            # 计算像素尺寸
            width_px = (bbox[2] - bbox[0]) * scale
            height_px = (bbox[3] - bbox[1]) * scale
            
            # 对于空字形，设置默认宽度
            if width_px == 0:
                width_px = font_size * 0.5
            
            # 计算左下角偏移量
            offset_x = -bbox[0]  # 左边界对齐到x=0
            offset_y = -bbox[1]  # 下边界对齐到y=0
            
            # 创建SVG路径笔
            svg_pen = SVGPathPen(font.getGlyphSet())
            
            # 创建变换矩阵: 先平移再缩放
            transform = Transform()
            transform = transform.translate(offset_x, offset_y)
            transform = transform.scale(scale, scale)
            
            # 应用变换
            transform_pen = TransformPen(svg_pen, transform)
            
            # 绘制字形
            try:
                glyph.draw(transform_pen, font.getGlyphSet())
                path_data = svg_pen.getCommands()
                
                # 转义路径数据中的特殊字符
                escaped_path = escape_xml(path_data)
                
                # 生成完整的SVG标签
                if path_data:
                    # 创建完整的SVG元素
                    svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width_px} {height_px}" width="{width_px}" height="{height_px}">'
                    svg_content += f'<path d="{escaped_path}" fill="black"/>'
                    svg_content += '</svg>'
                else:
                    # 对于空格等无路径的字形，创建空SVG
                    svg_content = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width_px} {height_px}" width="{width_px}" height="{height_px}"></svg>'
                
                # 存储字形数据
                glyph_data = {
                    "unicode": f"U+{unicode_val:04X}",
                    "svg": svg_content,
                    "width": round(width_px, 2),  # 保留两位小数
                    "height": round(height_px, 2)
                }
                
                glyphs.append(glyph_data)
            except Exception as e:
                print(f"处理字符 U+{unicode_val:04X} ({glyph_name}) 时出错: {str(e)}")
                missing_glyphs.append(f"U+{unicode_val:04X}")
        
        # 创建字体JSON结构
        font_data = {
            "name": font_name,
            "units_per_em": units_per_em,
            "font_size_px": font_size,
            "ascent_px": round(ascent * scale, 2),
            "descent_px": round(descent * scale, 2),
            "glyphs": glyphs,
            "missing_glyphs": missing_glyphs
        }
        
        # 保存为JSON文件
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(font_data, f, indent=2, ensure_ascii=False)
        
        print(f"成功转换 {len(glyphs)} 个字符")
        print(f"保存到: {output_file}")
        print(f"缺失 {len(missing_glyphs)} 个字形")
        
        return True
    
    except Exception as e:
        print(f"转换过程中出错: {str(e)}")
        traceback.print_exc()
        return False

def main():
    # 设置命令行参数解析
    parser = argparse.ArgumentParser(description='TTF字体转JSON工具（XML转义版）')
    parser.add_argument('input_file', type=str, help='输入字体文件路径(.ttf)')
    parser.add_argument('output_file', type=str, help='输出JSON文件路径')
    parser.add_argument('--size', type=int, default=16, 
                        help='字体大小(像素)，默认为16px')
    
    args = parser.parse_args()
    
    input_file = args.input_file
    output_file = args.output_file
    font_size = args.size
    
    # 检查输入文件是否存在
    if not os.path.isfile(input_file):
        print(f"错误: 输入文件 '{input_file}' 不存在")
        sys.exit(1)
    
    # 检查文件扩展名
    if not input_file.lower().endswith(('.ttf', '.otf')):
        print("警告: 输入文件可能不是TTF/OTF字体")
    
    # 检查字体大小
    if font_size <= 0:
        print("错误: 字体大小必须大于0")
        sys.exit(1)
    
    print(f"开始转换: {input_file} -> {output_file}")
    print(f"字体大小: {font_size}px")
    
    # 执行转换
    success = convert_ttf_to_json(input_file, output_file, font_size)
    
    if success:
        print("转换完成!")
    else:
        print("转换失败!")
        sys.exit(1)

if __name__ == "__main__":
    main()