import React, { useState, useCallback, useEffect } from 'react'

import styled, { css } from "styled-components";
import { background, color, layout, position, space } from "styled-system";
import { Button } from 'antd';

import { Link as Links } from 'react-router-dom'

import IOSLoadingIcon from '../IOSLoadingIcon'

// const status = {
//     primary: 0,
//     disabled: 3,
//     warning: 1,
//     error: 2
// }

const SIZE = {
    sm: '.2rem .6rem',
    xl: '.4rem .1.4rem',
    gl: '.8rem .1.6rem',
    xxl: '.9rem',
    bl: '1.8rem .2.6rem'
}

function Buttons({ children, loading, status, ...other }) {
    // console.log(status,'status', status == '2')
    return <Button {...other} status={status}><IOSLoadingIcon show={loading} />{children}</Button>
}

const ButtonStyled = styled(Buttons)`
    border: 0rem none !important;
    opacity: ${props => props.loading || props.disabled ? 0.6 : 1};
    &:before{
        border: 0rem none !important;
    }
    // border-radius: 1000rem  !important;
    text-transform: none !important;
    position: relative;
    ${p => p.w ? 'width:' + p.w + '%' : ''};
    ${p => p.width ? 'width:' + p.width : ''};
    ${p => p.height ? 'height:' + p.height : ''};
    &.MuiButton-root {
        font-size: ${p => p.size === 'sm' ? .8 : 1}rem;
        padding: ${p => SIZE[p.size] || '.3rem 1.1rem'};
        min-width: 2em;
    }
    ${p => p.loading || p.disabled ? 'pointer-events:none' : ''};
    ${props => props.theme.button[props.status || 0]}
    ${space}
`

const Left = css`
    &:after {
        top: 0;
        left: 0;
        border-top: 5rem solid transparent;
        border-bottom: 5rem solid transparent;
        border-left: 1rem solid  ${props => props.left};
        border-right: 5rem solid transparent;
    };
`

const Right = css`
    &:after {
        bottom: 0;
        right: 0;
        border-top: 5rem solid transparent;
        border-bottom: 5rem solid transparent;
        border-left: 5rem solid transparent;
        border-right: 1rem solid ${props => props.right};
    };
`

const BevelButtonStyled = styled(Button)`
    position: relative;
    opacity: ${props => props.active ? 1 : 0.6};
    z-index: 0;
    ${props => props.theme.button[props.status || 0]};
    width: 100%;
    border: 0rem none !important;
    &:before{
        border: 0rem none !important;
    }
`
export const BevelButton = styled(BevelButtonStyled)`
    /* display: contents; */
    overflow: initial;
    &:after {
        content: ' ';
        position: absolute;
        border-style: solid;
        width:100%;
        /* border-width: 4.2rem 1.2rem; */
        z-index: -1;
    };
    ${props => props.left ? Left : ''};
    ${props => props.right ? Right : ''};
`


export const Link = styled(Links)`
    ${props => props.theme.button[props.status || 0]};
    padding: 1rem;
    display: block;
    border-radius: ${props => props.theme.borderRadius};
    text-align: center;
`


export default ButtonStyled

export function ChooseButtons({ disabled, loading, size, style, className, buttonClass, list, value, onChange = () => { } }) {
    const [actives, setActive] = useState(value || list[0].id)
    useEffect(() => {
        setActive(value)
    }, [value])
    const choose = useCallback(el => {
        let target = el.target
        while (!target.dataset.active) {
            target = target.parentElement
        }
        onChange(target.dataset.active)
        setActive(target.dataset.active)
    }, [])
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            ...style
        }} className={className}>
            {
                list.map(v =>
                    <ButtonStyled
                        disabled={v.disabled || disabled}
                        loading={loading}
                        size={size}
                        className={buttonClass}
                        style={{ width: ((100 / list.length) * 0.97) + '%' }}
                        key={v.id}
                        status={actives === v.id ? 0 : 1}
                        data-active={v.id}
                        onClick={choose}
                    >
                        {v.title}
                    </ButtonStyled>
                )
            }
        </div>
    )
}
