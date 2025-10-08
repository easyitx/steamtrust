import { useState, useEffect } from 'react'
import { apiService } from '../api'
import type { 
  ITransaction, 
  TransactionResponse, 
  TransactionQueryParams, 
  Payment, 
  PaymentsListResponse, 
  PaymentsHistoryParams, 
  Promocode, 
  PromocodesListResponse, 
  CreatePromocodeRequest 
} from '../types/api'
import PaymentMethods from './PaymentMethods'
import './TeslaDashboard.css'

interface TeslaDashboardProps {
  onLogout: () => void
}

interface BalanceData {
  id: number
  balance: number
  cashback: number
  currency: string
}

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T[]
}

const TeslaDashboard: React.FC<TeslaDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview')
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Транзакции
  const [transactions, setTransactions] = useState<ITransaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [executingPayment, setExecutingPayment] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [transactionsSteamLoginSearch, setTransactionsSteamLoginSearch] = useState('')
  
  // Платежи
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsCurrentPage, setPaymentsCurrentPage] = useState(1)
  const [paymentsTotalPages, setPaymentsTotalPages] = useState(0)
  const [paymentsEmailSearch, setPaymentsEmailSearch] = useState('')
  
  // Промокоды
  const [promocodes, setPromocodes] = useState<Promocode[]>([])
  const [promocodesLoading, setPromocodesLoading] = useState(false)
  const [promocodesCurrentPage, setPromocodesCurrentPage] = useState(1)
  const [promocodesTotalPages, setPromocodesTotalPages] = useState(0)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPromocodeCode, setNewPromocodeCode] = useState('')
  const [newPromocodeBonusPercent, setNewPromocodeBonusPercent] = useState(2)
  const [creatingPromocode, setCreatingPromocode] = useState(false)

  const itemsPerPage = 10

  // Загрузка баланса
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true)
      try {
        const response = await apiService.getBalance()
        const apiResponse: ApiResponse<BalanceData> = response.data
        if (apiResponse.success && apiResponse.data.length > 0) {
          setBalanceData(apiResponse.data[0])
        }
      } catch (err) {
        console.error('Ошибка при загрузке баланса:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBalance()
  }, [])

  // Загрузка транзакций
  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeSection !== 'transactions') return
      
      setTransactionsLoading(true)
      try {
        const params: TransactionQueryParams = {
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          sort_by: 'id',
          sort_order: 'desc'
        }
        
        const response = await apiService.getTransactions(params)
        const transactionData: TransactionResponse = response.data
        
        if (transactionData && transactionData.success && Array.isArray(transactionData.data.items)) {
          setTransactions(transactionData.data.items)
          setTotalTransactions(transactionData.data.total || 0)
        }
      } catch (err) {
        console.error('Ошибка при загрузке транзакций:', err)
      } finally {
        setTransactionsLoading(false)
      }
    }
    fetchTransactions()
  }, [activeSection, currentPage, transactionsSteamLoginSearch])

  // Сброс страницы при изменении поиска по Steam Login
  useEffect(() => {
    if (transactionsSteamLoginSearch) {
      setCurrentPage(1)
    }
  }, [transactionsSteamLoginSearch])

  // Загрузка платежей
  useEffect(() => {
    const fetchPayments = async () => {
      if (activeSection !== 'payments') return
      
      setPaymentsLoading(true)
      try {
        const params: PaymentsHistoryParams = {
          limit: itemsPerPage,
          page: paymentsCurrentPage,
          ...(paymentsEmailSearch && { email: paymentsEmailSearch })
        }
        
        const response = await apiService.getPaymentsHistory(params)
        const paymentsData: PaymentsListResponse = response.data
        
        if (paymentsData && paymentsData.success && Array.isArray(paymentsData.data.items)) {
          setPayments(paymentsData.data.items)
          setPaymentsTotalPages(paymentsData.data.pageCount || Math.ceil(paymentsData.data.total / itemsPerPage))
        }
      } catch (err) {
        console.error('Ошибка при загрузке платежей:', err)
      } finally {
        setPaymentsLoading(false)
      }
    }
    fetchPayments()
  }, [activeSection, paymentsCurrentPage, paymentsEmailSearch])

  // Загрузка промокодов
  useEffect(() => {
    const fetchPromocodes = async () => {
      if (activeSection !== 'promocodes') return
      
      setPromocodesLoading(true)
      try {
        const params = {
          page: promocodesCurrentPage,
          limit: itemsPerPage
        }
        
        const response = await apiService.getPromocodes(params)
        const promocodesData: PromocodesListResponse = response.data
        
        if (promocodesData && Array.isArray(promocodesData.data)) {
          setPromocodes(promocodesData.data)
          setPromocodesTotalPages(promocodesData.totalPages || 0)
        }
      } catch (err) {
        console.error('Ошибка при загрузке промокодов:', err)
      } finally {
        setPromocodesLoading(false)
      }
    }
    fetchPromocodes()
  }, [activeSection, promocodesCurrentPage])

  // Выполнение платежа
  const handleExecutePayment = async (transactionCode: string) => {
    const confirmed = window.confirm(`Выполнить платеж ${transactionCode}?`)
    if (!confirmed) return
    
    setExecutingPayment(transactionCode)
    try {
      await apiService.executePayment(transactionCode)
      // Обновляем список транзакций
      const params: TransactionQueryParams = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        sort_by: 'id',
        sort_order: 'desc'
      }
      const response = await apiService.getTransactions(params)
      const transactionData: TransactionResponse = response.data
      if (transactionData && transactionData.success && Array.isArray(transactionData.data.items)) {
        setTransactions(transactionData.data.items)
      }
    } catch (err) {
      console.error('Ошибка при выполнении платежа:', err)
    } finally {
      setExecutingPayment(null)
    }
  }

  // Создание промокода
  const handleCreatePromocode = async () => {
    if (!newPromocodeCode.trim()) return
    
    setCreatingPromocode(true)
    try {
      const data: CreatePromocodeRequest = {
        code: newPromocodeCode.trim(),
        bonusPercent: newPromocodeBonusPercent
      }
      
      await apiService.createPromocode(data)
      
      // Обновляем список промокодов
      const params = {
        page: promocodesCurrentPage,
        limit: itemsPerPage
      }
      const response = await apiService.getPromocodes(params)
      const promocodesData: PromocodesListResponse = response.data
      if (promocodesData && Array.isArray(promocodesData.data)) {
        setPromocodes(promocodesData.data)
      }
      
      // Сбрасываем форму
      setNewPromocodeCode('')
      setNewPromocodeBonusPercent(2)
      setShowCreateForm(false)
    } catch (err) {
      console.error('Ошибка при создании промокода:', err)
    } finally {
      setCreatingPromocode(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'RUB') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return '#00D563'
      case 'pending':
        return '#FFB800'
      case 'failed':
        return '#FF4444'
      default:
        return '#8A8A8A'
    }
  }

  return (
    <div className="tesla-dashboard">
      {/* Sidebar */}
      <div className="tesla-sidebar">
        <div className="tesla-logo">
          <div className="logo-icon">⚡</div>
          <span>Admin</span>
        </div>
        
        <nav className="tesla-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Обзор
          </button>
          <button 
            className={`nav-item ${activeSection === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveSection('transactions')}
          >
            Транзакции
          </button>
          <button 
            className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveSection('payments')}
          >
            Платежи
          </button>
          <button 
            className={`nav-item ${activeSection === 'payment-methods' ? 'active' : ''}`}
            onClick={() => setActiveSection('payment-methods')}
          >
            Методы оплаты
          </button>
          <button 
            className={`nav-item ${activeSection === 'promocodes' ? 'active' : ''}`}
            onClick={() => setActiveSection('promocodes')}
          >
            Промокоды
          </button>
        </nav>
        
        <button className="tesla-logout" onClick={onLogout}>
          Выход
        </button>
      </div>

      {/* Main Content */}
      <div className="tesla-main">
        {/* Header */}
        <div className="tesla-header">
          <h1>
            {activeSection === 'overview' && 'Обзор'}
            {activeSection === 'transactions' && 'Транзакции'}
            {activeSection === 'payments' && 'Платежи'}
            {activeSection === 'promocodes' && 'Промокоды'}
          </h1>
        </div>

        {/* Content */}
        <div className="tesla-content">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="overview-section">
              <div className="balance-card">
                <div className="balance-header">
                  <h3>Баланс</h3>
                  {isLoading && <div className="loading-spinner"></div>}
                </div>
                {balanceData && (
                  <div className="balance-info">
                    <div className="balance-item">
                      <span className="balance-label">Основной баланс</span>
                      <span className="balance-value">
                        {formatCurrency(balanceData.balance, balanceData.currency)}
                      </span>
                    </div>
                    <div className="balance-item">
                      <span className="balance-label">Кэшбэк</span>
                      <span className="balance-value">
                        {formatCurrency(balanceData.cashback, balanceData.currency)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {activeSection === 'transactions' && (
            <div className="transactions-section">
              {/* Search Filter */}
              <div className="filters">
                <input
                  type="text"
                  placeholder="Поиск по Steam Login..."
                  value={transactionsSteamLoginSearch}
                  onChange={(e) => setTransactionsSteamLoginSearch(e.target.value)}
                  className="tesla-input"
                />
              </div>
              
              {transactionsLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Загрузка транзакций...</span>
                </div>
              ) : (
                <>
                  <div className="tesla-table">
                    <div className="table-header">
                      <div>ID</div>
                      <div>Код</div>
                      <div>Steam Login</div>
                      <div>Сумма</div>
                      <div>Статус</div>
                      <div>Дата</div>
                      <div>Действия</div>
                    </div>
                    {transactions
                      .filter(transaction => 
                        !transactionsSteamLoginSearch || 
                        transaction.steam_login.toLowerCase().includes(transactionsSteamLoginSearch.toLowerCase())
                      )
                      .map((transaction) => (
                      <div key={transaction.id} className="table-row">
                        <div>{transaction.id}</div>
                        <div className="code-cell">{transaction.code}</div>
                        <div>{transaction.steam_login}</div>
                        <div>{formatCurrency(transaction.amount, transaction.currency)}</div>
                        <div>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(transaction.status_code) }}
                          >
                            {transaction.status_code}
                          </span>
                        </div>
                        <div>{formatDate(transaction.date)}</div>
                        <div>
                          <button
                            className="action-btn"
                            onClick={() => handleExecutePayment(transaction.code)}
                            disabled={executingPayment === transaction.code}
                          >
                            {executingPayment === transaction.code ? '...' : 'Выполнить'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <div className="tesla-pagination">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    <span>{currentPage} из {Math.ceil(totalTransactions / itemsPerPage)}</span>
                    <button 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalTransactions / itemsPerPage)}
                    >
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Payments Section */}
          {activeSection === 'payments' && (
            <div className="payments-section">
              <div className="filters">
                <input
                  type="text"
                  placeholder="Поиск по email"
                  value={paymentsEmailSearch}
                  onChange={(e) => setPaymentsEmailSearch(e.target.value)}
                  className="tesla-input"
                />
              </div>

              {paymentsLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Загрузка платежей...</span>
                </div>
              ) : (
                <>
                  <div className="tesla-table">
                    <div className="table-header">
                      <div>ID</div>
                      <div>Email</div>
                      <div>Аккаунт</div>
                      <div>Сумма</div>
                      <div>Статус</div>
                      <div>Дата</div>
                    </div>
                    {payments.map((payment) => (
                      <div key={payment._id} className="table-row">
                        <div className="code-cell">{payment._id.slice(-8)}</div>
                        <div>{payment.userId}</div>
                        <div>{payment.account}</div>
                        <div>{formatCurrency(parseFloat(payment.amount))}</div>
                        <div>
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(payment.status) }}
                          >
                            {payment.status}
                          </span>
                        </div>
                        <div>{formatDate(payment.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="tesla-pagination">
                    <button 
                      onClick={() => setPaymentsCurrentPage(Math.max(1, paymentsCurrentPage - 1))}
                      disabled={paymentsCurrentPage === 1}
                    >
                      ←
                    </button>
                    <span>{paymentsCurrentPage} из {paymentsTotalPages}</span>
                    <button 
                      onClick={() => setPaymentsCurrentPage(paymentsCurrentPage + 1)}
                      disabled={paymentsCurrentPage >= paymentsTotalPages}
                    >
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Payment Methods Section */}
          {activeSection === 'payment-methods' && (
            <PaymentMethods />
          )}

          {/* Promocodes Section */}
          {activeSection === 'promocodes' && (
            <div className="promocodes-section">
              <div className="section-header">
                <button 
                  className="tesla-btn primary"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? 'Отмена' : 'Создать промокод'}
                </button>
              </div>

              {showCreateForm && (
                <div className="create-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Код промокода"
                      value={newPromocodeCode}
                      onChange={(e) => setNewPromocodeCode(e.target.value)}
                      className="tesla-input"
                    />
                    <input
                      type="number"
                      placeholder="Бонус %"
                      value={newPromocodeBonusPercent}
                      onChange={(e) => setNewPromocodeBonusPercent(Number(e.target.value))}
                      className="tesla-input"
                      min="0"
                      max="100"
                    />
                    <button
                      className="tesla-btn primary"
                      onClick={handleCreatePromocode}
                      disabled={creatingPromocode || !newPromocodeCode.trim()}
                    >
                      {creatingPromocode ? 'Создание...' : 'Создать'}
                    </button>
                  </div>
                </div>
              )}

              {promocodesLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Загрузка промокодов...</span>
                </div>
              ) : (
                <>
                  <div className="tesla-table">
                    <div className="table-header">
                      <div>Код</div>
                      <div>Бонус %</div>
                      <div>Создан</div>
                      <div>Обновлен</div>
                    </div>
                    {promocodes.map((promocode) => (
                      <div key={promocode._id} className="table-row">
                        <div className="code-cell">{promocode.code}</div>
                        <div>{promocode.bonusPercent}%</div>
                        <div>{formatDate(promocode.createdAt)}</div>
                        <div>{formatDate(promocode.updatedAt)}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="tesla-pagination">
                    <button 
                      onClick={() => setPromocodesCurrentPage(Math.max(1, promocodesCurrentPage - 1))}
                      disabled={promocodesCurrentPage === 1}
                    >
                      ←
                    </button>
                    <span>{promocodesCurrentPage} из {promocodesTotalPages}</span>
                    <button 
                      onClick={() => setPromocodesCurrentPage(promocodesCurrentPage + 1)}
                      disabled={promocodesCurrentPage >= promocodesTotalPages}
                    >
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeslaDashboard