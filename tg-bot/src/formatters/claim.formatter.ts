export function formatClaimSuccess(
  data: { status: string; message: string; explorer: string; note: string },
) {
  return `
✅ ${data.status}

${data.message}

${data.explorer}

${data.note}
`;
}

export function formatClaimError(err: any) {
  if (err.response?.data?.error) {
    return `❌ <b>Error:</b> ${err.response.data.error}`;
  }

  if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    return "❌ Faucet server is currently unreachable.";
  }

  return "❌ Connection error. Please try again.";
}
