import styled, { keyframes, css } from 'styled-components';

const toRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null;
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
  font-family: ${p => p.theme.font || 'inherit'};
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

  textarea {
    min-height: 150px;
  }
`;

const Loader = styled.div`
  margin: 50px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: ${p => p.theme.loader.width} solid rgba(255, 255, 255, 0.2);
  border-right: ${p => p.theme.loader.width} solid rgba(255, 255, 255, 0.2);
  border-bottom: ${p => p.theme.loader.width} solid rgba(255, 255, 255, 0.2);
  border-left: ${p => p.theme.loader.width} solid ${p => p.theme.loader.color};
  transform: translateZ(0);
  animation: ${load} 0.5s infinite linear;
  border-radius: 50%;
  width: ${p => p.theme.loader.size};
  height: ${p => p.theme.loader.size};

  &:after {
    border-radius: 50%;
    width: ${p => p.theme.loader.size};
    height: ${p => p.theme.loader.size};
  }
`;

const Container = styled.div`
  display: none;
  background: ${p => p.theme.background};
  position: relative;
  z-index: 999999999;
  border-radius: 4px;
  margin-bottom: 1.5em;
  width: 360px;
  top: -2.5em;
  right: 0;
  box-shadow: 0 6px 30px 2px rgba(${toRgb('#222c4f')}, 0.3);
  ${animationFadeOutDown};

  &.active {
    ${animationFadeInUp};
    display: block;
  }
`;

const Header = styled.div`
  display: flex;
  background: ${p => p.theme.secondary};
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
  padding: ${p => p.theme.padding};
`;

const Icon = styled.div`
  margin-right: 0.5em;
`;

const Trigger = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  align-items: center;
  background: ${p => p.theme.trigger.background};
  color: ${p => p.theme.trigger.color};
  border: 1px solid ${p => p.theme.trigger.border};
  white-space: nowrap;
  padding: ${p => p.theme.trigger.padding};
  border-radius: ${p => p.theme.trigger.borderRadius};
  cursor: pointer;
  font-size: ${p => p.theme.trigger.fontSize};
  box-shadow: ${p => p.theme.trigger.shadow};
  transition: box-shadow 0.3s, transform 0.2s ease-in, color 0.2s;

  &:hover {
    box-shadow: 0 6px 16px 2px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
    color: ${p => p.theme.trigger.hoverColor};
    border-color: ${p => p.theme.border};
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
    background: rgba(255, 255, 255, 0.1);
    color: ${p => p.theme.color};
    text-align: center;
    padding: 0.75em;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    border: 1px solid ${p => p.theme.border};

    &.selected {
      border-color: ${p => p.theme.primary};
      background: ${p => p.theme.primary};
      color: white;
      position: relative;
      text-shadow: 0 1px 6px rgba(${p => p.theme.primary}, 0.1);
      box-shadow: 0 0 8px rgba(${p => p.theme.primary}, 0.2);
    }

    &:hover:not(.selected) {
      border: 1px solid darken(${p => p.theme.border}, 8%);
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

const UploadButton = styled.label`
  border: 1px solid ${p => p.theme.border};
  padding: 0.75em 3em;
  text-align: center;
  font-size: 13px;
  margin: auto;
  width: 100%;
  display: table;
  color: darken(${p => p.theme.text}, 5%);
  background: #ffffff;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    border: 1px solid darken(${p => p.theme.border}, 7%);
    background: rgba(#ffffff, 0.6);
    color: darken(${p => p.theme.text}, 5%);
  }
`;

const Label = styled.label`
  color: ${p => p.theme.primary};
  display: block;
  font-size: 11px;
  margin: 5px 0;
`;

const FormElement = styled.input`
  ${formStyles};

  color: ${p => p.theme.text};
  width: 100%;
  color: ${p => p.theme.input.color};
  border: 1px solid ${p => p.theme.border};
  border-radius: ${p => p.theme.input.borderRadius};
  padding: ${p => p.theme.input.padding};
  outline: none;
  font-size: ${p => p.theme.input.fontSize};
  background: ${p => p.theme.input.background};
  margin-bottom: 0.5em;

  &:focus {
    border: 1px solid ${p => p.theme.primary};
    box-shadow: 0 0 8px rgba(${p => toRgb(p.theme.primary)}, 0.3);
  }

  &[disabled],
  &.disabled {
    background: #fafafa;
    pointer-events: none;
    color: ${p => p.theme.text};
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
    color: #858ba0;
  }
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 1em 0.75em;
  text-align: center;
  background: ${p => p.theme.primary};
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
    opacity: 0.4;
  }

  &.sent {
    background: ${p => p.theme.success};
    pointer-events: none;
  }

  &.error {
    background: ${p => p.theme.error};
    pointer-events: none;
  }

  &:hover {
    background: lighten(${p => p.theme.primary}, 7%);
    box-shadow: 0 2px 8px 2px rgba(${p => p.theme.primary}, 0.2);
  }
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: rgba(${p => toRgb(p.theme.secondary)}, 0.4);
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
    background: rgba(${p => toRgb(p.theme.secondary)}, 0.6);
    transition: background 0.15s;

    &:hover {
      background: ${p => p.theme.primary};
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
  border: 1px solid ${p => p.theme.border};

  &:hover {
    .SlackFeedback--preview-overlay {
      opacity: 1;
    }
  }
`;

const Select = styled.div`
  margin-bottom: 0.5em;

  .Select-control {
    border: 1px solid ${p => p.theme.border};
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
