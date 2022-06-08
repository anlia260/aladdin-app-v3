import React,{ memo } from 'react'
import styled from 'styled-components'

function IOSLoadingIcon({color,show = false}) {
    if ( !show ) {
        return <></>
    }
    return (
        <Preloader>
            <span className="preloader-inner">
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
                <span className="preloader-inner-line" />
            </span>
        </Preloader>
    )
}

export default memo(IOSLoadingIcon)

const Preloader = styled.span`
    display: inline-block;
    vertical-align: middle;
    width: 1.4rem;
    height: 1.4rem;
    font-size: 0;
    position: relative;
    padding: 0.2rem;
    .preloader-inner {
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        animation: ios-preloader-spin 1s steps(8,end) infinite;
        .preloader-inner-line {
            display: block;
            width: 11.6%;
            height: 33.33%;
            border-radius: 100px;
            background: #6c6c6c;
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: center 150%;
            animation: ios-preloader-multicolor 3s linear infinite;
            &:nth-child(1) {
                transform: translate(-50%,-150%) rotate(0deg);
                opacity: .27;
            }

            &:nth-child(1) {
                transform: translate(-50%,-150%) rotate(0deg);
                opacity: .27
            }

            &:nth-child(2) {
                transform: translate(-50%,-150%) rotate(45deg);
                opacity: .35285714
            }

            &:nth-child(3) {
                transform: translate(-50%,-150%) rotate(90deg);
                opacity: .43571429
            }

            &:nth-child(4) {
                transform: translate(-50%,-150%) rotate(135deg);
                opacity: .51857143
            }

            &:nth-child(5) {
                transform: translate(-50%,-150%) rotate(180deg);
                opacity: .60142857
            }

            &:nth-child(6) {
                transform: translate(-50%,-150%) rotate(225deg);
                opacity: .68428571
            }

            &:nth-child(7) {
                transform: translate(-50%,-150%) rotate(270deg);
                opacity: .76714286
            }

            &:nth-child(8) {
                transform: translate(-50%,-150%) rotate(315deg);
                opacity: .85
            }
        }
    }
    @keyframes ios-preloader-spin {
        100% {
            transform: rotate(360deg)
        }
    }
    @keyframes ios-preloader-multicolor {
        0%,100% {
            background-color: #959899;
        }
    }

`