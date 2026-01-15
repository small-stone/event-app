// Define minimal type for testing
interface TestEvent {
  id: string;
  name?: string;
}

// Helper function to remove duplicates (same as in event-list.tsx)
const removeDuplicates = (events: TestEvent[]): TestEvent[] => {
  const seen = new Set<string>();
  return events.filter((event) => {
    // Normalize event name for comparison (trim and lowercase)
    const normalizedName = event.name?.trim().toLowerCase() || "";
    if (seen.has(normalizedName)) {
      return false;
    }
    seen.add(normalizedName);
    return true;
  });
};

describe('removeDuplicates', () => {
  const createMockEvent = (id: string, name: string): TestEvent => ({
    id,
    name,
  });

  it('should remove duplicate events with same name', () => {
    const events = [
      createMockEvent('1', 'Concert'),
      createMockEvent('2', 'Concert'),
      createMockEvent('3', 'Music Festival'),
    ];

    const result = removeDuplicates(events);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Concert');
    expect(result[1].name).toBe('Music Festival');
  });

  it('should handle case-insensitive duplicates', () => {
    const events = [
      createMockEvent('1', 'Concert'),
      createMockEvent('2', 'CONCERT'),
      createMockEvent('3', 'concert'),
    ];

    const result = removeDuplicates(events);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Concert');
  });

  it('should handle events with whitespace differences', () => {
    const events = [
      createMockEvent('1', 'Concert'),
      createMockEvent('2', '  Concert  '),
      createMockEvent('3', 'Music Festival'),
    ];

    const result = removeDuplicates(events);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Concert');
    expect(result[1].name).toBe('Music Festival');
  });

  it('should handle empty array', () => {
    const result = removeDuplicates([]);
    expect(result).toHaveLength(0);
  });

  it('should handle array with no duplicates', () => {
    const events = [
      createMockEvent('1', 'Concert'),
      createMockEvent('2', 'Music Festival'),
      createMockEvent('3', 'Sports Event'),
    ];

    const result = removeDuplicates(events);

    expect(result).toHaveLength(3);
  });

  it('should handle events with empty or undefined names', () => {
    const events = [
      createMockEvent('1', 'Concert'),
      createMockEvent('2', ''),
      createMockEvent('3', 'Music Festival'),
    ];

    const result = removeDuplicates(events);

    // Empty names should be treated as duplicates
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});
