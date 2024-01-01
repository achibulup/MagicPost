import { redirect } from 'next/navigation';
import React from 'react'

export default async function AggregationPage() {
  redirect('/home/admin/facilities');
}
