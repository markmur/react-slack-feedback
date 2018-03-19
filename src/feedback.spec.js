import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import SlackFeedback from './feedback';

configure({ adapter: new Adapter() });

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
