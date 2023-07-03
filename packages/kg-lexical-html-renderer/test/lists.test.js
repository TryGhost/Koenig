const {shouldRender} = require('./utils');

describe('Lists', function () {
    it('ul', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ul><li>one</li><li>two</li></ul>'
    }));

    it('ol', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ol><li>one</li><li>two</li></ol>'
    }));

    it('ul > ul', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.two","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ul><li>one<ul><li>two.one</li><li>two.two</li></ul></li><li>three</li></ul>'
    }));

    it('ol > ol', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.two","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ol><li>one<ol><li>two.one</li><li>two.two</li></ol></li><li>three</li></ol>'
    }));

    it('ul > ol', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.two","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ul><li>one<ol><li>two.one</li><li>two.two</li></ol></li><li>three</li></ul>'
    }));

    it('ol > ul', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.two","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ul><li>one<ol><li>two.one</li><li>two.two</li></ol></li><li>three</li></ul>'
    }));

    it('ul > ol > ul', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three.one","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three.two","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.three","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ul><li>one<ol><li>two.one<ul><li>three.one</li><li>three.two</li></ul></li><li>two.three</li></ol></li><li>three</li></ul>'
    }));

    it('ol > ul > ol', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"one","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.one","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three.one","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three.two","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two.three","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ol><li>one<ul><li>two.one<ol><li>three.one</li><li>three.two</li></ol></li><li>two.three</li></ul></li><li>three</li></ol>'
    }));

    it('containing text formats', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"bold","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":2,"mode":"normal","style":"","text":"italic","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":3,"mode":"normal","style":"","text":"bold+italic","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":1,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ol><li><strong>bold</strong></li><li><em>italic</em></li><li><strong><em>bold+italic</em></strong></li></ol>'
    }));

    it('ol with start value > 1', shouldRender({
        input: `{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"two","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"three","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"number","start":2,"tag":"ol"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        output: '<ol start="2"><li>two</li><li>three</li></ol>'
    }));

    it('containing double formats', shouldRender({
        input: `{
            "root": {
              "children": [
                {
                  "children": [
                    {
                      "children": [
                        {
                          "detail": 0,
                          "format": 1,
                          "mode": "normal",
                          "style": "",
                          "text": "Figure ",
                          "type": "text",
                          "version": 1
                        },
                        {
                          "detail": 0,
                          "format": 3,
                          "mode": "normal",
                          "style": "",
                          "text": "you.",
                          "type": "text",
                          "version": 1
                        },
                        {
                          "detail": 0,
                          "format": 0,
                          "mode": "normal",
                          "style": "",
                          "text": " Just test",
                          "type": "text",
                          "version": 1
                        }
                      ],
                      "direction": "ltr",
                      "format": "",
                      "indent": 0,
                      "type": "listitem",
                      "version": 1,
                      "value": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "type": "list",
                  "version": 1,
                  "listType": "number",
                  "start": 1,
                  "tag": "ol"
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "type": "root",
              "version": 1
            }
          }`,
        output: '<ol><li><strong>Figure <em>you.</em></strong> Just test</li></ol>'
    }));
});
