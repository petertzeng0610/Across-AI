"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

const AccountPage = () => {
  return (
    <div className="account-page">
      {/* Other content here */}
      <div className="contact-section">
        <Link href="mailto:info@twister5.com.tw">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">聯繫我們</Button>
        </Link>
      </div>
      {/* Assuming this is the section where the "免費諮詢" button should be placed */}
      <div className="purchase-section">
        <div className="mt-4 md:mt-0">
          <Link href="mailto:info@twister5.com.tw">
            <Button className="btn-primary text-white font-normal">免費諮詢</Button>
          </Link>
        </div>
      </div>
      {/* rest of code here */}
    </div>
  )
}

export default AccountPage
