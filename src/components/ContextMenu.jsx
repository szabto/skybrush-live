/**
 * @file Context menu using a Popover element that displays connands to send to the
 * currently selected UAVs.
 */

import { autobind } from 'core-decorators'
import PropTypes from 'prop-types'
import React from 'react'

import Popover from '@material-ui/core/Popover'
import MenuList from '@material-ui/core/MenuList'

/**
 * Generic context menu using a Material-UI popover element.
 *
 * This component handles the logic related to opening and closing the context
 * menu. The actual menu items must be declared as children of this
 * component.
 */
export default class ContextMenu extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      opening: false,
      position: {
        top: 0,
        left: 0
      },
      context: undefined
    }
  }

  /**
   * Public method to open the context menu.
   *
   * @param {Object} position Coordinates where the absolutely positioned popup
   *        should appear.
   * @property {number} left The offset of the context menu from the left edge of the page.
   * @property {number} top The offset of the context menu from the top edge of the page.
   * @param {Object} context Context object to pass to the click handlers of
   *        the menu items as their second argument.
   */
  open (position, context) {
    // Prevent the document body from firing a contextmenu event
    document.body.addEventListener(
      'contextmenu', this._preventDefault
    )

    // Start opening the context menu
    this.setState({
      opening: true,
      open: false,
      position,
      context
    })
  }

  /**
   * Private method to request the closing of the context menu when the user
   * selects a menu item or clicks away.
   */
  @autobind
  _handleClose () {
    document.body.removeEventListener(
      'contextmenu', this._preventDefault
    )

    this.setState({
      open: false,
      opening: false,
      context: undefined
    })
  }

  /**
   * Right click handler to prevent the default context menu of the browser
   * while the menu is opening and close it if the event happens when it's
   * already open.
   *
   * @param {MouseEvent} e The event being fired.
   */
  @autobind
  _preventDefault (e) {
    if (this.state.opening) {
      this.setState({ opening: false, open: true })
    } else {
      this._handleClose()
    }

    e.preventDefault()
  }

  render () {
    const { children } = this.props
    const { context, open, opening, position } = this.state

    const menuItems = React.Children.map(children,
      child => React.cloneElement(child,
        {
          onClick: child.props.onClick
            ? event => {
              child.props.onClick(event, context)
              this._handleClose()
            }
            : undefined
        }
      )
    )

    return (
      <Popover
        open={open || opening}
        anchorReference='anchorPosition'
        anchorPosition={position}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={this._handleClose}
      >
        <MenuList>
          {menuItems}
        </MenuList>
      </Popover>
    )
  }
}

ContextMenu.propTypes = {
  children: PropTypes.node
}
