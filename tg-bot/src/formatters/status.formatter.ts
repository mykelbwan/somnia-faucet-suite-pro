export function formatStatusMessage(
  wallet: string,
  data: Record<string, string>
) {
  const statusLines = Object.entries(data)
    .map(
      ([token, time]) =>
        `${time === "Ready" ? "✅" : "⏳"} <b>${token}:</b> ${time}`
    )
    .join("\n");

  return `
<b>📊 Status for:</b> <code>${wallet}</code>

${statusLines}
`;
}
