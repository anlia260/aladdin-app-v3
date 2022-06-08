import {useState, useEffect} from 'react'

// 这里要是 传入 元素的话 需要 报上 memo
function useButtonText(initChildren) {
    const [button, setButton] = useState({
        loading: false,
        children: initChildren
    })

    const loadingButton = children => {
        setButton({
            loading: true,
            children: children || initChildren
        })
    }

    const initButton = (children = initChildren) => {
        setButton({
            loading: false,
            children: children
        })
    }

    const setButtonText = (children = initChildren) => {
        setButton(v => {
            if ( v.loading ) return v
            return {
                loading: v.loading,
                children: children
            }
        })
    }

    useEffect(() => {
        setButton(v => ({
            loading: v.loading,
            children: v.loading === false ? initChildren : v.children
        }))
    }, [initChildren])

    return {
        button,
        loadingButton,
        initButton,
        setButtonText
        // disabled
    }
}

export default useButtonText