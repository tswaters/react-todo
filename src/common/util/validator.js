
export default class Validator {

  constructor () {
    this.components = {}
  }

  register (component) {
    const {id} = component.props
    this.components[id] = {component, ivalidHandler: this.setInvalid(id)}
    component.input.addEventListener('invalid', this.components[id].ivalidHandler)
  }

  unregister (component) {
    const {id} = component.props
    const {ivalidHandler} = this.components[id]
    const {input} = component
    input.removeEventListener('invalid', ivalidHandler)
    delete this.components[id]
  }

  setInvalid (id) {
    return () => {
      const {component} = this.components[id]
      component.setState({error: new Error(component.input.validationMessage)})
    }
  }

  validateField (component) {
    const {input, props} = component
    component.setState({validating: true})

    // Special handling for `sameAs` prop
    if (props.sameAs) {
      const other = this.components[props.sameAs]
      const {input: otherInput} = other.component
      input.setCustomValidity(otherInput.value === input.value ? '' : props.sameAsError)
    }

    const result = input.checkValidity()
    if (result) {
      component.setState({error: null})
    }
    return result
  }

  validate () {
    return Object.keys(this.components).reduce((memo, item) => {
      const {component} = this.components[item]
      component.setState({validating: true})
      if (!this.validateField(component)) { return false }
      return memo
    }, true)
  }

}
