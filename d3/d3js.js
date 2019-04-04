// 样式添加
var style = document.createElement('style');
style.type = 'text/css';
var cssStyle = ".labeltext {font-size: 16px;font - family: SimSun;fill: #000000;}.nodetext {font - size: 12px;font - family: SimSun;fill: #000000;}.linetext {font - size: 12px;font - family: SimSun;fill: #0000FF;fill - opacity: 0.0;}.d3List,.d3List tr th,.d3List tr td {border: 1px solid #cccdce;}"
style.innerHTML = cssStyle;
document.getElementsByTagName("head").item(0).appendChild(style);

var oD3 = document.getElementById("d3");
var type = oD3.getAttribute("data-type");
console.log("type：", type)

// is table or visual
if (type == 'list') {
    tableList()
} else if (type == 'visual') {
    visual()
}

// list
function tableList() {
    oD3.style.width = oD3.getAttribute("data-type-width") + 'px';
    oD3.style.height = oD3.getAttribute("data-type-height") + 'px';
    oD3.innerHTML = `<table class='d3List' 
    style='width:100%;min-height: 25px; line-height: 25px; text-align: center; border-collapse: collapse; padding:2px;'>
    <thead>
        <tr>
            <td>姓名</td>
            <td>年龄</td>
            <td>性别</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>赵四</td>
            <td>67</td>
            <td>男</td>
        </tr>
    </tbody>
</table>`
}

// visual
function visual() {
    var width = oD3.getAttribute("data-type-width");
    var height = oD3.getAttribute("data-type-height");
    var img_w = 77;
    var img_h = 90;

    var svg = d3.select("#d3").append("svg")
        .attr("width", width)
        .attr("height", height);

    // d3.json("", function (error, root) {

    // if (error) {
    //     return console.log(11,error);
    // }
    var root = {
        "nodes": [
            {
                "name": "云天河",
                "image": "tianhe.png"
            },
            {
                "name": "韩菱纱",
                "image": "lingsha.png"
            },
            {
                "name": "柳梦璃",
                "image": "mengli.png"
            },
            {
                "name": "慕容紫英",
                "image": "ziying.png"
            },
            {
                "name": "云天青",
                "image": "tianqing.png"
            },
            {
                "name": "夙玉",
                "image": "suyu.png"
            },
            {
                "name": "玄霄",
                "image": "xuanxiao.png"
            },
            {
                "name": "夙瑶",
                "image": "suyao.png"
            },
            {
                "name": "太清",
                "image": "taiqing.png"
            },
            {
                "name": "宗炼",
                "image": "zonglian.png"
            },
            {
                "name": "婵幽",
                "image": "chanyou.png"
            },
            {
                "name": "奚仲",
                "image": "xizhong.png"
            },
            {
                "name": "归邪",
                "image": "guixie.png"
            }
        ],
        "edges": [
            {
                "source": 0,
                "target": 1,
                "relation": "挚友"
            },
            {
                "source": 0,
                "target": 2,
                "relation": "挚友"
            },
            {
                "source": 0,
                "target": 3,
                "relation": "挚友"
            },
            {
                "source": 1,
                "target": 2,
                "relation": "挚友"
            },
            {
                "source": 1,
                "target": 3,
                "relation": "挚友"
            },
            {
                "source": 2,
                "target": 3,
                "relation": "挚友"
            },
            {
                "source": 0,
                "target": 4,
                "relation": "父子"
            },
            {
                "source": 0,
                "target": 5,
                "relation": "母子"
            },
            {
                "source": 4,
                "target": 5,
                "relation": "夫妻"
            },
            {
                "source": 0,
                "target": 6,
                "relation": "义兄弟"
            },
            {
                "source": 4,
                "target": 6,
                "relation": "同门"
            },
            {
                "source": 5,
                "target": 6,
                "relation": "同门"
            },
            {
                "source": 4,
                "target": 7,
                "relation": "同门"
            },
            {
                "source": 5,
                "target": 7,
                "relation": "同门"
            },
            {
                "source": 6,
                "target": 7,
                "relation": "同门"
            },
            {
                "source": 4,
                "target": 8,
                "relation": "师徒"
            },
            {
                "source": 5,
                "target": 8,
                "relation": "师徒"
            },
            {
                "source": 6,
                "target": 8,
                "relation": "师徒"
            },
            {
                "source": 7,
                "target": 8,
                "relation": "师徒"
            },
            {
                "source": 8,
                "target": 9,
                "relation": "同门"
            },
            {
                "source": 3,
                "target": 9,
                "relation": "师徒"
            },
            {
                "source": 2,
                "target": 10,
                "relation": "母子"
            },
            {
                "source": 10,
                "target": 11,
                "relation": "主臣"
            },
            {
                "source": 10,
                "target": 12,
                "relation": "主臣"
            },
            {
                "source": 11,
                "target": 12,
                "relation": "同僚"
            }
        ]
    }
    var force = d3.layout.force()
        .nodes(root.nodes)
        .links(root.edges)
        .size([width, height])
        .linkDistance(200)
        .charge(-1500)
        .start();

    var label_text_1 = svg.append("text")
        .attr("class", "labeltext")
        .attr("x", 10)
        .attr("y", 16)
        .text("运动状态：开始");

    var label_text_2 = svg.append("text")
        .attr("class", "labeltext")
        .attr("x", 10)
        .attr("y", 40)
        .text("拖拽状态：结束");

    var edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);

    var edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class", "linetext")
        .text(function (d) {
            return d.relation;
        });

    var drag = force.drag()
        .on("dragstart", function (d, i) {
            d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
            label_text_2.text("拖拽状态：开始");
        })
        .on("dragend", function (d, i) {
            label_text_2.text("拖拽状态：结束");
        })
        .on("drag", function (d, i) {
            label_text_2.text("拖拽状态：进行中");
        });

    var nodes_img = svg.selectAll("image")
        .data(root.nodes)
        .enter()
        .append("image")
        .attr("width", img_w)
        .attr("height", img_h)
        .attr("xlink:href", function (d) {
            return d.image;
        })
        .on("mouseover", function (d, i) {
            //显示连接线上的文字
            edges_text.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d) {
                    return 1.0;
                }
            });
        })
        .on("mouseout", function (d, i) {
            //隐去连接线上的文字
            edges_text.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d) {
                    return 0.0;
                }
            });
        })
        .on("dblclick", function (d, i) {
            d.fixed = false;
        })
        .call(drag);

    var text_dx = -20;
    var text_dy = 20;

    var nodes_text = svg.selectAll(".nodetext")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class", "nodetext")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            return d.name;
        });

    //力学图运动开始时
    force.on("start", function () {
        label_text_1.text("运动状态：开始");
    });

    //力学图运动结束时
    force.on("end", function () {
        label_text_1.text("运动状态：结束");
    });

    force.on("tick", function () {

        //修改标签文字
        label_text_1.text("运动状态：进行中");

        //限制结点的边界
        root.nodes.forEach(function (d, i) {
            d.x = d.x - img_w / 2 < 0 ? img_w / 2 : d.x;
            d.x = d.x + img_w / 2 > width ? width - img_w / 2 : d.x;
            d.y = d.y - img_h / 2 < 0 ? img_h / 2 : d.y;
            d.y = d.y + img_h / 2 + text_dy > height ? height - img_h / 2 - text_dy : d.y;
        });

        //更新连接线的位置
        edges_line.attr("x1", function (d) { return d.source.x; });
        edges_line.attr("y1", function (d) { return d.source.y; });
        edges_line.attr("x2", function (d) { return d.target.x; });
        edges_line.attr("y2", function (d) { return d.target.y; });

        //更新连接线上文字的位置
        edges_text.attr("x", function (d) { return (d.source.x + d.target.x) / 2; });
        edges_text.attr("y", function (d) { return (d.source.y + d.target.y) / 2; });


        //更新结点图片和文字
        nodes_img.attr("x", function (d) { return d.x - img_w / 2; });
        nodes_img.attr("y", function (d) { return d.y - img_h / 2; });

        nodes_text.attr("x", function (d) { return d.x });
        nodes_text.attr("y", function (d) { return d.y + img_w / 2; });
    });
    // });
}
