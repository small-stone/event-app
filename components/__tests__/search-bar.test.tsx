import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
  const mockOnChangeText = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    expect(getByPlaceholderText('Search events...')).toBeTruthy();
  });

  it('should display the value', () => {
    const { getByDisplayValue } = render(
      <SearchBar value="test search" onChangeText={mockOnChangeText} />
    );
    expect(getByDisplayValue('test search')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} />
    );
    const input = getByPlaceholderText('Search events...');
    
    fireEvent.changeText(input, 'new search');
    expect(mockOnChangeText).toHaveBeenCalledWith('new search');
  });

  it('should show clear button when value is not empty', () => {
    const { getByText } = render(
      <SearchBar value="test" onChangeText={mockOnChangeText} onClear={mockOnClear} />
    );
    expect(getByText('✕')).toBeTruthy();
  });

  it('should not show clear button when value is empty', () => {
    const { queryByText } = render(
      <SearchBar value="" onChangeText={mockOnChangeText} onClear={mockOnClear} />
    );
    expect(queryByText('✕')).toBeNull();
  });

  it('should call onClear when clear button is pressed', () => {
    const { getByText } = render(
      <SearchBar value="test" onChangeText={mockOnChangeText} onClear={mockOnClear} />
    );
    const clearButton = getByText('✕');
    
    fireEvent.press(clearButton);
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should use custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Custom placeholder"
      />
    );
    expect(getByPlaceholderText('Custom placeholder')).toBeTruthy();
  });
});
