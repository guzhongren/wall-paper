import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import { Provider} from 'react-redux'
import Template from '../../../src/components/Template'
import store from '../../../src/store'


describe("Test", () => {
  beforeAll(() => {  
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });

  afterEach(cleanup)


test('canary test', () => {
  expect(true)
})

  test('can render with redux with defaults', () => {
    const {getByLabelText, asFragment } = render(<Provider store={store}>
      <Template />
    </Provider>)
    expect(asFragment()).toMatchSnapshot()

    const inputNode = getByLabelText('分辨率', { selector: 'input' })
    expect(inputNode.value).toBe('1')
    
    fireEvent.click(inputNode)
    inputNode.value = '123'
    expect(inputNode.value).toBe('123')
    expect(asFragment()).toMatchSnapshot()
  })

});


