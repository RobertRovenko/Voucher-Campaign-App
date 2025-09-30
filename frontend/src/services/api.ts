const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Campaigns
export async function getCampaigns() {
  const res = await fetch(`${API_URL}/campaigns`);
  return res.json();
}

export async function createCampaign(data: any) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCampaign(id: string) {
  await fetch(`${API_URL}/campaigns/${id}`, { method: "DELETE" });
}

export async function getVouchers(
  campaignId: string,
  page = 1,
  limit = 50
) {
  const res = await fetch(
    `${API_URL}/campaigns/${campaignId}/vouchers?page=${page}&limit=${limit}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch vouchers (status: ${res.status})`);
  }

  return res.json(); // should be { data: Voucher[], total: number }
}

  

export async function createVouchers(campaignId: string, count: number) {
  const res = await fetch(`${API_URL}/campaigns/${campaignId}/vouchers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
  return res.json();
}

export async function downloadVouchersCSV(campaignId: string) {
  const res = await fetch(`${API_URL}/campaigns/${campaignId}/vouchers/csv`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vouchers_${campaignId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


export function createVouchersStream(
    campaignId: string,
    count: number,
    batchSize = 100,
    onUpdate: (progress: { batchCreated: number; totalCreated: number }) => void,
    onDone?: () => void
  ) {
    const url = `${API_URL}/campaigns/${campaignId}/vouchers/stream?count=${count}&batchSize=${batchSize}`;
    const evtSource = new EventSource(url);
  
    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.done) {
        evtSource.close();
        onDone?.();
      } else {
        onUpdate(data);
      }
    };
  
    evtSource.onerror = () => {
      console.error("Stream error");
      evtSource.close();
    };
  
    return evtSource;
  }
  
  // Delete a single voucher
export async function deleteVoucher(voucherId: string) {
  const res = await fetch(`${API_URL}/vouchers/${voucherId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete voucher");
  }

  return res.json();
}

