import styled, { keyframes, css } from 'styled-components'
import { get } from './utils'

const theme = (key, fallback = 'inherit') => (props = {}) =>
  get(props.theme, key, fallback)

const resets = css`
  box-shadow: none;
  color: inherit;
  margin: inherit;
  padding: inherit;
`

const formStyles = css`
  ${resets};
  box-sizing: border-box;
`

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 10%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
`

export const animationFadeInUp = css`
  animation: ${fadeInUp} 0.4s ease;
  animation-fill-mode: both;
`

const fadeOutDown = keyframes`
  from {
    opacity: 1;
    transform: none;
  }

  to {
    opacity: 0;
    display: none;
    transform: translate3d(0, 10%, 0);
  }
`

export const animationFadeOutDown = css`
  animation: ${fadeOutDown} 0.4s ease;
  animation-fill-mode: both;
`

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SlackFeedback = styled.div`
  position: fixed;
  font-family: ${theme('fontFamily', 'inherit')};
  z-index: 99999998;
  bottom: 12px;
  right: 0;
  margin: 1em;

  * {
    box-sizing: border-box;
  }

  textarea {
    min-height: 150px;
  }
`

const Loader = styled.div`
  margin: 50px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: ${theme('loader.width')} solid rgba(255, 255, 255, 0.2);
  border-right: ${theme('loader.width')} solid rgba(255, 255, 255, 0.2);
  border-bottom: ${theme('loader.width')} solid rgba(255, 255, 255, 0.2);
  border-left: ${theme('loader.width')} solid ${theme('loader.color')};
  transform: translateZ(0);
  animation: ${load} 0.5s infinite linear;
  border-radius: 50%;
  width: ${theme('loader.size')};
  height: ${theme('loader.size')};

  &:after {
    border-radius: 50%;
    width: ${theme('loader.width')};
    height: ${theme('loader.size')};
  }
`

const Container = styled.div`
  display: none;
  background: ${theme('colors.background')};
  position: relative;
  z-index: 999999999;
  border-radius: 4px;
  margin-bottom: 1.5em;
  width: ${theme('content.width', '360px')};
  top: -2.5em;
  right: 0;
  box-shadow: ${theme('content.boxShadow')};
  ${animationFadeOutDown};

  &.active {
    ${animationFadeInUp};
    display: block;
  }
`

const CloseButton = styled.div`
  cursor: pointer;
  opacity: 0.7;
  margin-left: auto;
  font-size: 11px;

  &:hover {
    opacity: 1;
  }
`

const Header = styled.div`
  display: flex;
  color: ${theme('header.color')};
  background: ${theme('colors.secondary')};
  padding: 0.75em 1em;
  border-radius: 3px 3px 0 0;
  font-size: 14px;
  font-weight: 300;
  align-items: center;

  > img {
    margin-right: 0.5em;
  }
`

const Content = styled.div`
  padding: ${theme('content.padding')};
`

const Icon = styled.div`
  margin-right: 0.5em;
`

const Trigger = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  align-items: center;
  font-weight: ${theme('trigger.fontWeight', 'normal')};
  background: ${theme('trigger.backgroundColor')};
  color: ${theme('trigger.color')};
  border: 1px solid ${theme('trigger.border')};
  white-space: nowrap;
  padding: ${theme('trigger.padding')};
  border-radius: ${theme('trigger.borderRadius')};
  cursor: pointer;
  font-size: ${theme('trigger.fontSize')};
  box-shadow: ${theme('trigger.boxShadow')};
  transition: box-shadow 0.3s, transform 0.2s ease-in, color 0.2s;

  &:hover {
    box-shadow: ${theme('trigger.hoverBoxShadow')};
    background-color: ${theme('trigger.hoverBackgroundColor', 'inherit')}
    transform: translateY(-1px);
    color: ${theme('trigger.hoverColor')};
    border-color: ${theme('colors.border')};
  }

  img {
    margin-right: 8px;
  }
`

const Tabs = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1em;

  > li {
    flex: 1 0 calc(100% / 3);
    user-select: none;
    background: ${theme('tab.backgroundColor')};
    color: ${theme('tab.color')};
    text-align: center;
    padding: 0.75em;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: ${theme('tab.border')};

    &.selected {
      border-color: ${theme('colors.primary')};
      background: ${theme('colors.primary')};
      color: white;
      position: relative;
    }

    &:hover:not(.selected) {
      border: ${theme('tab.border')};
    }

    &:first-of-type {
      border-radius: 4px 0 0 4px;
      margin-right: -1px;
    }

    &:last-of-type {
      border-radius: 0 4px 4px 0;
      margin-left: -1px;
    }
  }
`

const ImageUpload = styled.div`
  > input {
    display: none;
  }
`

const UploadButton = styled.label`
  color: ${theme('uploadButton.color')};
  background: ${theme('uploadButton.backgroundColor')};
  border: ${theme('uploadButton.border')};
  padding: 0.75em 3em;
  text-align: center;
  font-size: ${theme('uploadButton.fontSize', '13px')};
  margin: auto;
  width: 100%;
  display: table;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: ${theme('uploadButton.hoverBackgroundColor')};
    color: ${theme('uploadButton.hoverColor')};
  }
`

const Label = styled.label`
  color: ${theme('colors.primary')};
  display: block;
  font-size: ${theme('label.fontSize')};
  margin: 5px 0;
`

const FormElement = styled.input`
  ${formStyles};

  width: 100%;
  color: ${theme('input.color', '#000000')};
  border: ${theme('input.border', 'none')};
  border-radius: ${theme('input.borderRadius', '3px')};
  padding: ${theme('input.padding', 0)};
  font-size: ${theme('input.fontSize', '14px')};
  background: ${theme('input.backgroundColor', '#ffffff')};
  margin-bottom: 0.75em;
  outline: none;
  resize: none;

  &:focus {
    border: 1px solid ${theme('colors.primary')};
    box-shadow: ${theme('input.boxShadow', 'none')};
  }

  &[disabled],
  &.disabled {
    background: ${theme('input.backgroundColor', '#ffffff')};
    pointer-events: none;
    color: ${theme('input.color')};
  }
`

const Checkbox = styled.input`
  ${formStyles};
  appearance: checkbox;
  position: static;
  font-size: 1.1em;

  &::before,
  &::after {
    content: none;
  }
`

const CheckboxContainer = styled.div`
  padding: 0.5em 0 1em;
`

const CheckboxLabel = styled.label`
  display: inline-block;
  margin-left: 10px;
  color: inherit;
  font-size: 13px;
  color: #858ba0;
  cursor: pointer;

  &:hover {
    color: #858ba0;
  }
`

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1em 0.75em;
  text-align: center;
  background: ${theme('colors.primary')};
  color: white;
  font-weight: 400;
  outline: none;
  border: none;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;

  &[disabled],
  &.disabled {
    pointer-events: none;
    opacity: 0.8;
  }

  &.sent {
    background: ${theme('colors.success')};
    pointer-events: none;
    opacity: 1;
  }

  &.error {
    background: ${theme('colors.error')};
    pointer-events: none;
    opacity: 1;
  }

  &:hover {
    background: ${theme('colors.primary')};
    box-shadow: none;
  }
`

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: ${theme('overlay.backgroundColor')};
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    padding: 1em 3em;
    font-size: 12px;
    text-transform: uppercase;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    background: ${theme('overlay.backgroundColor')};
    transition: background 0.15s;

    &:hover {
      background: ${theme('colors.secondary')};
    }
  }
`

const ImagePreview = styled.div`
  background-size: cover;
  background-position: center center;
  position: relative;
  width: 100%;
  height: ${theme('image.height')};
  border-radius: ${theme('image.borderRadius', '4px')};
  margin-bottom: 5px;
  border: ${theme('image.border')};
`

const Select = styled.div`
  margin-bottom: 0.5em;
`

export {
  Checkbox,
  CheckboxContainer,
  CheckboxLabel,
  CloseButton,
  Container,
  Content,
  FormElement,
  Header,
  Icon,
  ImagePreview,
  ImageUpload,
  Label,
  Loader,
  PreviewOverlay,
  Select,
  SlackFeedback,
  SubmitButton,
  Tabs,
  Trigger,
  UploadButton
}
