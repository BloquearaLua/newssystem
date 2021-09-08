

export default function CollapsedReducer(preState = { isCollapsed: false }, action){
    const { type } = action;
    switch (type) {
        case 'change_collapsed':
            let newState = { ...preState };
            newState.isCollapsed = !newState.isCollapsed;
            return newState;
        default:
            return preState;
    }
    
}

