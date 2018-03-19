import React from 'react';
import { shallow } from 'enzyme';
import SlackFeedback from './feedback';

const onSubmit = jest.fn();
const onImageUpload = jest.fn();

const DEFAULT_PROPS = {
  user: 'markmur',
  emoji: ':bug:',
  channel: '#feedback',
  onSubmit,
  onImageUpload
};

const render = props =>
  shallow(<SlackFeedback {...Object.assign({}, DEFAULT_PROPS, props)} />);

describe('SlackFeedback', () => {
  const component = render();

  it('should match the snapshots', () => {
    expect(component).toMatchSnapshot();
  });
});
