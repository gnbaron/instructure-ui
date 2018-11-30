/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react'
import { expect, mount, stub, within } from '@instructure/ui-test-utils'
import RadioInput from '../../RadioInput'
import RadioInputGroup from '../index'

describe('<RadioInputGroup />', async () => {
  it('adds the name props to all RadioInput types', async () => {
    const subject = await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const inputs = await group.findAll('input[name="fruit"]')
    expect(inputs.length).to.equal(3)
  })

  it('requires an `onChange` prop with a `value` prop', async () => {
    const consoleError = stub(console, 'error')
    await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
        value="banana"
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )

    expect(consoleError).to.have.been.calledWithMatch(`provided a 'value' prop without an 'onChange' handler`)
  })

  it('calls the onChange prop', async () => {
    const onChange = stub()
    const subject = await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
        onChange={onChange}
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const input = await group.find('input')

    await input.click()
    expect(onChange).to.have.been.called()
  })

  it('does not call the onChange prop when disabled', async () => {
    const onChange = stub()
    const subject = await mount(
      <RadioInputGroup
        disabled
        name="fruit"
        description="Select a fruit"
        onChange={onChange}
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const input = await group.find('input')

    await input.click()
    expect(onChange).to.not.have.been.called()
  })

  it('does not call the onChange prop when readOnly', async () => {
    const onChange = stub()
    const subject = await mount(
      <RadioInputGroup
        readOnly
        name="fruit"
        description="Select a fruit"
        onChange={onChange}
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const input = await group.find('input')

    await input.click()
    expect(onChange).to.not.have.been.called()
  })

  it('should not update the value when the value prop is set', async () => {
    const subject = await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
        value='orange'
        onChange={() => {}}
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const banana = await group.find('input[value="banana"]')

    await banana.click()

    const orange = await group.find('input:label(Orange)')

    expect(orange.getDOMNode().checked).to.be.true()
  })

  it('adds the correct tabindex to RadioInputs when none are checked', async () => {
    const subject = await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const inputs = await group.findAll('input[name="fruit"]')

    expect(inputs[0].getAttribute('tabindex')).to.equal('0')
    expect(inputs[1].getAttribute('tabindex')).to.equal('-1')
    expect(inputs[2].getAttribute('tabindex')).to.equal('-1')
  })

  it('adds the correct tabindex to RadioInputs when checked', async () => {
    const subject = await mount(
      <RadioInputGroup
        name="fruit"
        description="Select a fruit"
        defaultValue="banana"
      >
        <RadioInput label="Apple" value="apple" />
        <RadioInput label="Banana" value="banana" />
        <RadioInput label="Orange" value="orange" />
      </RadioInputGroup>
    )
    const group = within(subject.getDOMNode())
    const inputs = await group.findAll('input[name="fruit"]')

    expect(inputs[0].getAttribute('tabindex')).to.equal('-1')
    expect(inputs[1].getAttribute('tabindex')).to.equal('0')
    expect(inputs[2].getAttribute('tabindex')).to.equal('-1')
  })

  describe('for a11y', async () => {
    it('should meet standards', async () => {
      const subject = await mount(
        <RadioInputGroup
          name="fruit"
          description="Select a fruit"
        >
          <RadioInput label="Apple" value="apple" />
          <RadioInput label="Banana" value="banana" />
          <RadioInput label="Orange" value="orange" />
        </RadioInputGroup>
      )
      const group = within(subject.getDOMNode())

      expect(await group.accessible({
        ignores: [ 'radiogroup' ] /* https://github.com/dequelabs/axe-core/issues/176 */
      })).to.be.true()
    })
  })
})
