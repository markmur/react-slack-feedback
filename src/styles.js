import styled, { keyframes, css } from 'styled-components';

// $border: #d0d8e1;
// $blue: #0088ff;
// $green: #3dc86f;
// $red: #ec3c3c;
// $background: #f4f4f7;
// $navy: #222c4f;
// $text: #858ba0;
//
// $loader-color: white;
// $loader-size: 4em;
// $loader-width: 7px;

const resets = css`
  box-shadow: none;
  color: inherit;
  margin: inherit;
  padding: inherit;
`;

const formStyles = css`
  ${css};
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

const animationFadeInUp = css`
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

const animationFadeOutDown = css`
  animation: ${fadeOutDown} 0.4s ease;
  animation-fill-mode: both;
`;

const Load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SlackFeedback = styled.div`
  position: fixed;
  font-family: 'Proxima Nova', sans-serif;
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
  border-top: $loader-width solid rgba(white, 0.2);
  border-right: $loader-width solid rgba(white, 0.2);
  border-bottom: $loader-width solid rgba(white, 0.2);
  border-left: $loader-width solid $loader-color;
  transform: translateZ(0);
  animation: SlackFeedback-loader 0.5s infinite linear;
  border-radius: 50%;
  width: $loader-size;
  height: $loader-size;

  &:after {
    border-radius: 50%;
    width: $loader-size;
    height: $loader-size;
  }
`;

const Container = styled.div`
  display: none;
  background: $background;
  position: relative;
  z-index: 999999999;
  border-radius: 4px;
  margin-bottom: 1.5em;
  width: 360px;
  top: -2.5em;
  right: 0;
  box-shadow: 0 6px 30px 2px rgba($navy, 0.3);
`;

const Header = styled.div`
  display: flex;
  background: $navy;
  padding: 0.75em 1em;
  border-radius: 3px 3px 0 0;
  font-size: 14px;
  font-weight: 300;
  align-items: center;
  color: white;

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
  background: white;
  color: $text;
  border: 1px solid $border;
  white-space: nowrap;
  padding: 12px 1.25em;
  border-radius: 30px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 3px 12px 1px rgba($navy, 0.1);
  transition: box-shadow 0.3s, transform 0.2s ease-in, color 0.2s;
  @extend .border-box;

  &:hover,
  &.active {
    box-shadow: 0 6px 16px 2px rgba(black, 0.2);
    transform: translateY(-3px);
    color: #5d606c;
    border-color: darken($border, 10%);
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
    background: rgba(white, 0.6);
    color: #5d606c;
    text-align: center;
    padding: 0.75em;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid $border;

    &.selected {
      border-color: #08f;
      background: white;
      color: #08f;
      position: relative;
      text-shadow: 0 1px 6px rgba($blue, 0.1);
      box-shadow: 0 0 8px rgba($blue, 0.2);
    }

    &:hover:not(.selected) {
      border: 1px solid darken($border, 8%);
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
  border: 1px solid $border;
  padding: 0.75em 3em;
  text-align: center;
  font-size: 13px;
  margin: auto;
  width: 100%;
  display: table;
  color: darken($text, 5%);
  background: white;
  cursor: pointer;
  border-radius: 4px;
  @extend .border-box;

  &:hover {
    border: 1px solid darken($border, 7%);
    background: rgba(white, 0.6);
    color: darken($text, 5%);
  }
`;

const Input = styled.input`
  margin-bottom: 0.75em;
  color: $text;
`;

const Textarea = styled.textarea`
  min-height: 150px;
`;

const Label = styled.label`
  color: $blue;
  display: block;
  font-size: 11px;
  margin: 5px 0;
`;

const FormElement = styled.input`
  ${formStyles};

  width: 100%;
  color: #444;
  border: 1px solid $border;
  border-radius: 3px;
  padding: 0.5em;
  outline: none;
  font-size: 14px;
  background: white;
  margin-bottom: 0.5em;
  @extend .border-box;

  &:focus {
    border: 1px solid $blue;
    box-shadow: 0 0 8px rgba($blue, 0.3);
  }

  &[disabled],
  &.disabled {
    opacity: 0.8;
    pointer-events: none;
    color: darken($text, 13%);
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
  display: block !important;
  width: 100% !important;
  padding: 1em 0.75em !important;
  text-align: center !important;
  background: $blue !important;
  color: white !important;
  font-weight: 400;
  outline: none;
  border: none;
  font-size: 11px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;

  &[disabled],
  &.disabled {
    pointer-events: none !important;
    opacity: 0.4 !important;
  }

  &.sent {
    background: $green !important;
    pointer-events: none;
  }

  &.error {
    background: $red !important;
    pointer-events: none;
  }

  &:hover {
    background: lighten($blue, 7%);
    box-shadow: 0 2px 8px 2px rgba($blue, 0.2);
  }
`;

const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  background: rgba($navy, 0.4);
  opacity: 0;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em 3em;
    font-size: 12px;
    text-transform: uppercase;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    background: rgba($navy, 0.6);
    transition: background 0.15s;

    &:hover {
      background: $blue;
    }
  }
`;

const ImagePreview = styled.div`
  @extend .border-box;
  background-size: cover;
  background-position: center center;
  position: relative;
  width: 100%;
  height: 140px;
  border-radius: 4px;
  margin-bottom: 5px;
  border: 1px solid $border;

  &:hover {
    .SlackFeedback--preview-overlay {
      opacity: 1;
    }
  }
`;

const Select = styled.div`
  margin-bottom: 0.5em;

  .Select-control {
    border: 1px solid $border;
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
  Checkbox,
  CheckboxLabel,
  Label,
  Textarea,
  SubmitButton,
  PreviewOverlay,
  ImagePreview,
  Select,
  FormElement
};
