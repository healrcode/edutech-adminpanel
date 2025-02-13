# Neumorphic Styles Documentation
## Base Styles
### 1. Basic Raised Effect
The standard neumorphic raised effect with balanced shadows.
```css
{
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
  border-radius: 12px;
}
```
### 2. Pressed (Inset) Effect
Creates an impression of a pressed or sunken element.
```css
{
  background: #ececec;
  box-shadow: inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff;
  border-radius: 12px;
}
```
### 3. Hybrid Effect
Combines both raised and inset shadows for complex depth.
```css
{
  background: #f0f0f0;
  box-shadow: 8px 8px 16px #d1d1d1, 
              -8px -8px 16px #ffffff,
              inset 3px 3px 6px #d1d1d1,
              inset -3px -3px 6px #ffffff;
  border-radius: 12px;
}
```
### 4. Floating Effect
Enhanced shadows for a more pronounced elevation.
```css
{
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  box-shadow: 16px 16px 32px #c2c2c2, -16px -16px 32px #ffffff;
  border-radius: 16px;
}
```
### 5. Concave Effect
Creates a subtle depression effect with gradient.
```css
{
  background: linear-gradient(145deg, #d1d1d1, #ffffff);
  box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
  border-radius: 12px;
}
```
## Dark Mode Variations
### 1. Dark Basic Raised
```css
{
  background: linear-gradient(145deg, #2d2d2d, #363636);
  box-shadow: 8px 8px 16px #202020, -8px -8px 16px #404040;
  border-radius: 12px;
}
```
### 2. Dark Pressed
```css
{
  background: #2d2d2d;
  box-shadow: inset 8px 8px 16px #202020, inset -8px -8px 16px #404040;
  border-radius: 12px;
}
```
### 3. Dark Hybrid
```css
{
  background: #2d2d2d;
  box-shadow: 8px 8px 16px #202020,
              -8px -8px 16px #404040,
              inset 3px 3px 6px #202020,
              inset -3px -3px 6px #404040;
  border-radius: 12px;
}
```
### 4. Dark Floating
```css
{
  background: linear-gradient(145deg, #2d2d2d, #363636);
  box-shadow: 16px 16px 32px #1a1a1a, -16px -16px 32px #404040;
  border-radius: 16px;
}
```
### 5. Dark Concave
```css
{
  background: linear-gradient(145deg, #252525, #363636);
  box-shadow: 8px 8px 16px #202020, -8px -8px 16px #404040;
  border-radius: 12px;
}
```
## Implementation Tips
### Color Calculation
For creating your own color variations:
1. Base color: Choose your main surface color (e.g., #E0E0E0)
2. Dark shadow: Darken base by 10-15%
3. Light shadow: Lighten base by 10-15%
4. Gradient: Use a slightly lighter and darker version of base
### Shadow Intensity Formula
- Regular elements: 8px offset, 16px blur
- Floating elements: 16px offset, 32px blur
- Pressed elements: Same values but with inset
- Hybrid elements: Combine regular (8px/16px) with inset (3px/6px)
### Best Practices
1. Maintain consistent light source (top-left in these examples)
2. Use subtle gradients for enhanced depth
3. Keep border-radius consistent within similar elements
4. Adjust shadow intensity based on element size
5. Consider dark mode adaptations from the start
### Accessibility Considerations
1. Maintain sufficient contrast for text
2. Ensure interactive states are clearly visible
3. Consider reduced motion preferences
4. Test color combinations for color blindness
5. Provide focus indicators for interactive elements
## React Implementation Example
```jsx
const neumorphicStyles = {
  basic: {
    background: 'linear-gradient(145deg, #e6e6e6, #ffffff)',
    boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
    borderRadius: '12px',
  },
  pressed: {
    background: '#ececec',
    boxShadow: 'inset 8px 8px 16px #d1d1d1, inset -8px -8px 16px #ffffff',
    borderRadius: '12px',
  },
  // ... add other styles as needed
};
const NeuButton = ({ style = 'basic', children, ...props }) => (
  <button
    style={neumorphicStyles[style]}
    className="px-4 py-2 transition-all duration-300"
    {...props}
  >
    {children}
  </button>
);
```
## Common Issues and Solutions
### 1. Shadow Bleeding
Problem: Shadows visible outside container
Solution: Add overflow: hidden to parent container
### 2. Color Matching
Problem: Shadows don't match background
Solution: Use exact same color values for background and shadows
### 3. Mobile Performance
Problem: Shadow rendering performance
Solution: Reduce blur radius on mobile devices
### 4. Gradient Banding
Problem: Visible bands in gradients
Solution: Add slight noise texture or use smoother gradient steps

