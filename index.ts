import { v4 as uuidv4 } from 'uuid';

type layout = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    [x: string]: any
};

export const DragStopHelper = (layout: layout[], layout1: layout[]) => {
    const Ybound = layout1.map((item: any) => item.h + item.y);
    if (Ybound.find((element: any) => element > 8) !== undefined) {
        const _layout = layout.map((item: any) => ({
            ...item,
            static: false,
        }));
        return { layout: _layout, case: 1 }
    } else {
        return { layout: [], case: 2 };
    }
}

export const DropHelper = (layout: layout[], layout1: layout[], layoutItem: any, _event: DragEvent) => {
    if (layout1.length !== 0 && layoutItem !== undefined) {
        const { x, y, w, h } = layoutItem;
        const Ybound = layout1.map((item: any) => item.h + item.y);
        if (y >= 8 || y + h > 8 || (Ybound.find((element: any) => element > 8) !== undefined)) {
            const _layout = layout.map((item: any) => ({
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
            const _layout = layout1.filter((x: { i: string; }) => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }: any) => ({
                i, x, y, w, h, minW, minH, maxH, maxW,
                component: layout.find((x: layout) => x.i === i)?.component,
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

export const LayoutChangeHelper = (_layout: layout[], newLayout: layout[], layout: layout[]) => {
    const Ybound = _layout.map((item: any) => item.h + item.y);
    let originLayout = [];
    let tmp_layout = (newLayout.length !== 0 && (newLayout.length < layout.length)) ? newLayout : layout;
    if (Ybound.find((element: any) => element > 8) !== undefined) {
        originLayout = tmp_layout.filter((x: { i: string; }) => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }: any) => ({
            i, x, y, w, h, minW, minH, maxH, maxW,
            component: layout.find((x: layout) => x.i === i)?.component,
            isBounded: true,
            static: true
        }));
    } else {
        originLayout = _layout.filter(x => x.i !== '123').map(({ i, x, y, w, h, minW, minH, maxH, maxW }) => ({
            i, x, y, w, h, minW, minH, maxH, maxW,
            component: layout.find((x: layout) => x.i === i)?.component,
            isBounded: true,
            static: false
        }));
    }
    return originLayout;
}