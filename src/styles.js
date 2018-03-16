import styled, { keyframes, css } from 'styled-components';

const fontStack =
  '-apple-system, BlinkMacSystemFont, Arial, Arial Unicode, "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif';

const theme = {
  font: fontStack,
  border: '#d0d8e1',
  primary: '#0088ff',
  secondary: '#222c4f',
  background: '#f4f4f7',
  success: '#3dc86f',
  error: '#ec3c3c',
  text: '#858ba0',
  loader: {
    color: '#ffffff',
    size: '4em',
    width: '7px'
  }
};

const resets = css`
  box-shadow: none;
  color: inherit;
  margin: inherit;
  padding: inherit;
`;

const formStyles = css`
  ${resets};
  box-sizing: border-box;
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 10%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
`;

export const animationFadeInUp = css`
  animation: ${fadeInUp} 0.4s ease;
  animation-fill-mode: both;
`;

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
`;

export const animationFadeOutDown = css`
  animation: ${fadeOutDown} 0.4s ease;
  animation-fill-mode: both;
`;

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SlackFeedback = styled.div`
  position: fixed;
  font-family: ${theme.font};
  z-index: 99999998;
  bottom: 12px;
  right: 0;
  margin: 1em;

  &.active {
    .SlackFeedback--container {
      display: block;
    }
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

const Loader = styled.div`
  margin: 50px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: ${theme.loader.width} solid rgba(#ffffff, 0.2);
  border-right: ${theme.loader.width} solid rgba(#ffffff, 0.2);
  border-bottom: ${theme.loader.width} solid rgba(#ffffff, 0.2);
  border-left: ${theme.loader.width} solid ${theme.loader.color};
  transform: translateZ(0);
  animation: ${load} 0.5s infinite linear;
  border-radius: 50%;
  width: ${theme.loader.size};
  height: ${theme.loader.size};

  &:after {
    border-radius: 50%;
    width: ${theme.loader.size};
    height: ${theme.loader.size};
  }
`;

const Container = styled.div`
  background: ${theme.background};
  position: relative;
  z-index: 999999999;
  border-radius: 4px;
  margin-bottom: 1.5em;
  width: 360px;
  top: -2.5em;
  right: 0;
  box-shadow: 0 6px 30px 2px rgba(${theme.secondary}, 0.3);

  .active {
    display: block;
  }
`;

const Header = styled.div`
  display: flex;
  background: ${theme.secondary};
  padding: 0.75em 1em;
  border-radius: 3px 3px 0 0;
  font-size: 14px;
  font-weight: 300;
  align-items: center;
  color: #ffffff;

  > img {
    margin-right: 0.5em;
  }

  > .close {
    cursor: pointer;
    opacity: 0.7;
    margin-left: auto;
    font-size: 11px;

    &:hover {
      opacity: 1;
    }
  }
`;

const Content = styled.div`
  padding: 0.5em;
`;

const Icon = styled.div`
  margin-right: 0.5em;
`;

const Trigger = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  align-items: center;
  background: #ffffff;
  color: ${theme.text};
  border: 1px solid ${theme.border};
  #ffffff-space: nowrap;
  padding: 12px 1.25em;
  border-radius: 30px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 3px 12px 1px rgba(${theme.secondary}, 0.1);
  transition: box-shadow 0.3s, transform 0.2s ease-in, color 0.2s;

  &:hover,
  &.active {
    box-shadow: 0 6px 16px 2px rgba(#000000, 0.2);
    transform: translateY(-3px);
    color: #5d606c;
    border-color: darken(${theme.border}, 10%);
  }

  img {
    margin-right: 8px;
  }
`;

const Tabs = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 1em;

  > li {
    flex: 1;
    background: rgba(#ffffff, 0.6);
    color: #5d606c;
    text-align: center;
    padding: 0.75em;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid ${theme.border};

    &.selected {
      border-color: #08f;
      background: #ffffff;
      color: #08f;
      position: relative;
      text-shadow: 0 1px 6px rgba(${theme.primary}, 0.1);
      box-shadow: 0 0 8px rgba(${theme.primary}, 0.2);
    }

    &:hover:not(.selected) {
      border: 1px solid darken(${theme.border}, 8%);
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
`;

const ImageUpload = styled.div`
  > input {
    display: none;
  }
`;

const UploadButton = styled.button`
  border: 1px solid ${theme.border};
  padding: 0.75em 3em;
  text-align: center;
  font-size: 13px;
  margin: auto;
  width: 100%;
  display: table;
  color: darken(${theme.text}, 5%);
  background: #ffffff;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    border: 1px solid darken(${theme.border}, 7%);
    background: rgba(#ffffff, 0.6);
    color: darken(${theme.text}, 5%);
  }
`;

const Label = styled.label`
  color: ${theme.primary};
  display: block;
  font-size: 11px;
  margin: 5px 0;
`;

const FormElement = styled.input`
  ${formStyles};

  color: ${theme.text};
  width: 100%;
  color: #444;
  border: 1px solid ${theme.border};
  border-radius: 3px;
  padding: 0.5em;
  outline: none;
  font-size: 14px;
  background: #ffffff;
  margin-bottom: 0.5em;

  &:focus {
    border: 1px solid ${theme.primary};
    box-shadow: 0 0 8px rgba(${theme.primary}, 0.3);
  }

  &[disabled],
  &.disabled {
    opacity: 0.8;
    pointer-events: none;
    color: darken(${theme.text}, 13%);
  }
`;

const Checkbox = styled.input`
  ${formStyles};
  appearance: checkbox;
  position: static;
  font-size: 1.1em;

  &::before,
  &::after {
    content: none;
  }
`;

const CheckboxLabel = styled.label`
  display: inline-block;
  margin-left: 10px;
  color: inherit;
  font-size: 13px;
  color: #858ba0;
  cursor: pointer;

  &:hover {
    color: darken(#858ba0, 5%);
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1em 0.75em;
  text-align: center;
  background: ${theme.primary};
  color: #ffffff;
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
    opacity: 0.4;
  }

  &.sent {
    background: ${theme.success};
    pointer-events: none;
  }

  &.error {
    background: ${theme.error};
    pointer-events: none;
  }

  &:hover {
    background: lighten(${theme.primary}, 7%);
    box-shadow: 0 2px 8px 2px rgba(${theme.primary}, 0.2);
  }
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: rgba(${theme.secondary}, 0.4);
  opacity: 0;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em 3em;
    font-size: 12px;
    text-transform: uppercase;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    background: rgba(${theme.secondary}, 0.6);
    transition: background 0.15s;

    &:hover {
      background: ${theme.primary};
    }
  }
`;

const ImagePreview = styled.div`
  background-size: cover;
  background-position: center center;
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 4px;
  margin-bottom: 5px;
  border: 1px solid ${theme.border};

  &:hover {
    .SlackFeedback--preview-overlay {
      opacity: 1;
    }
  }
`;

const Select = styled.div`
  margin-bottom: 0.5em;

  .Select-control {
    border: 1px solid ${theme.border};
  }
`;

export {
  SlackFeedback,
  Loader,
  Container,
  Content,
  Header,
  Icon,
  Trigger,
  Tabs,
  Checkbox,
  CheckboxLabel,
  Label,
  SubmitButton,
  PreviewOverlay,
  ImageUpload,
  ImagePreview,
  Select,
  UploadButton,
  FormElement
};
