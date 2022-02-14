import { v4 as uuidv4 } from 'uuid';



function DragStopHelper(layout, layout1) {
    const Ybound = layout1.map((item) => item.h + item.y);
    if (Ybound.find((element) => element > 8) !== undefined) {
        const _layout = layout.map((item) => ({
            ...item,
            static: false,
        }));
        return { layout: _layout, case: 1 }
    } else {
        return { layout: [], case: 2 };
    }
}

function DropHelper(layout, layout1, layoutItem, _event) {
    if (layout1.length !== 0 && layoutItem !== undefined) {
        const { x, y, w, h } = layoutItem;
        const Ybound = layout1.map((item) => item.h + item.y);
        if (y >= 8 || y + h > 8 || (Ybound.find((element) => element > 8) !== undefined)) {
            const _layout = layout.map((item) => ({
                ...item,
                static: false,
                isBounded: true,
                lockAspectRatio: true,
            }));
            return { layout: _layout, case: 1 };
        } else {
            const [component, maxW, maxH] = _event.dataTransfer?.getData('text/plain').split(',') || [];
            const newCard = {
                i: uuidv4(),
                x: x,
                y: y,
                w: w,
                h: h,
                minW: w,
                minH: h,
                maxW: parseInt(maxW, 10),
                maxH: parseInt(maxH, 10),
                component,
                isBounded: true,
                lockAspectRatio: true,
                static: false,
            };
            const _layout = layout1.filter((x) => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }) => ({
                i, x, y, w, h, minW, minH, maxH, maxW,
                component: layout.find((x) => x.i === i)?.component,
                isBounded: true,
                lockAspectRatio: true,
                static: false
            }));
            return { layout: [..._layout, newCard], case: 2 };
        }
    } else {
        return { layout: [], case: 3 };
    }
}

function LayoutChangeHelper(_layout, newLayout, layout) {
    const Ybound = _layout.map((item) => item.h + item.y);
    let originLayout = [];
    let tmp_layout = (newLayout.length !== 0 && (newLayout.length < layout.length)) ? newLayout : layout;
    if (Ybound.find((element) => element > 8) !== undefined) {
        originLayout = tmp_layout.filter((x) => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }) => ({
            i, x, y, w, h, minW, minH, maxH, maxW,
            component: layout.find((x) => x.i === i)?.component,
            isBounded: true,
            static: true
        }));
    } else {
        originLayout = _layout.filter(x => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }) => ({
            i, x, y, w, h, minW, minH, maxH, maxW,
            component: layout.find((x) => x.i === i)?.component,
            isBounded: true,
            static: false
        }));
    }
    return originLayout;
}
module.exports = {DragStopHelper, LayoutChangeHelper, DropHelper};