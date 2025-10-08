import React, { useState, useEffect } from 'react';
import { apiService } from '../api';
import './PaymentMethods.css';

interface PaymentMethod {
  _id: string;
  providerMethod: string;
  provider: string;
  fromCurrencyCode: string;
  toCurrencyCode: string;
  min: number;
  max: number;
  relativeCommission: number;
  relativeProviderCommission: number;
  isActive: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethodsResponse {
  success: boolean;
  data: {
    items: PaymentMethod[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface EditingMethod {
  id: string;
  relativeCommission: number;
  relativeProviderCommission: number;
  isActive: boolean;
}

const PaymentMethods: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMethod, setEditingMethod] = useState<EditingMethod | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);
  const [filterProvider, setFilterProvider] = useState<string>('');

  const limit = 10;

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: limit,
      };

      if (filterActive !== undefined) {
        params.isActive = filterActive;
      }

      if (filterProvider) {
        params.provider = filterProvider;
      }

      const response = await apiService.getPaymentMethods(params);
      
      if (response.data.success) {
        setMethods(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        setError(null);
      } else {
        throw new Error('Failed to fetch payment methods');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, [currentPage, filterActive, filterProvider]);

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod({
      id: method._id,
      relativeCommission: method.relativeCommission,
      relativeProviderCommission: method.relativeProviderCommission,
      isActive: method.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingMethod(null);
  };

  const saveMethod = async (id: string, updatedMethod: PaymentMethod) => {
    try {
      const updateData = {
        relativeCommission: updatedMethod.relativeCommission,
        relativeProviderCommission: updatedMethod.relativeProviderCommission,
        isActive: updatedMethod.isActive,
      };

      const response = await apiService.updatePaymentMethod(id, updateData);
      
      if (response.data.success) {
        setMethods(prev => 
          prev.map(method => 
            method._id === id ? { ...method, ...updatedMethod } : method
          )
        );
        setEditingMethod(null);
        setError(null);
      } else {
        throw new Error('Failed to update payment method');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const handleSaveCommissions = async () => {
    if (!editingMethod) return;

    try {
      setSaving(true);
      const updateData = {
        relativeCommission: editingMethod.relativeCommission,
        relativeProviderCommission: editingMethod.relativeProviderCommission,
        isActive: editingMethod.isActive,
      };

      const response = await apiService.updatePaymentMethod(editingMethod.id, updateData);
      
      if (response.data.success) {
        // Обновляем локальное состояние
        setMethods(prevMethods =>
          prevMethods.map(method =>
            method._id === editingMethod.id
              ? { ...method, ...updateData }
              : method
          )
        );
        setEditingMethod(null);
        setError(null);
      } else {
        throw new Error('Failed to update payment method');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCommissionChange = (field: 'relativeCommission' | 'relativeProviderCommission', value: string) => {
    if (!editingMethod) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setEditingMethod({
      ...editingMethod,
      [field]: numValue,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const getProviderDisplayName = (provider: string) => {
    const providerNames: { [key: string]: string } = {
      'CRYPTOPAY': 'CryptoPay',
      'CARDLINK': 'CardLink',
    };
    return providerNames[provider] || provider;
  };

  if (loading && methods.length === 0) {
    return (
      <div className="payment-methods">
        <div className="loading">Загрузка методов оплаты...</div>
      </div>
    );
  }

  return (
    <div className="payment-methods">
      <div className="payment-methods-header">
        <h1>Методы оплаты</h1>
        <div className="filters">
          <select
            value={filterActive === undefined ? '' : filterActive.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setFilterActive(value === '' ? undefined : value === 'true');
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Все статусы</option>
            <option value="true">Активные</option>
            <option value="false">Неактивные</option>
          </select>
          
          <select
            value={filterProvider}
            onChange={(e) => {
              setFilterProvider(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Все провайдеры</option>
            <option value="CRYPTOPAY">CryptoPay</option>
            <option value="CARDLINK">CardLink</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="methods-table-container">
        <table className="methods-table">
          <thead>
            <tr>
              <th>Метод</th>
              <th>Провайдер</th>
              <th>Валюты</th>
              <th>Лимиты</th>
              <th>Комиссия (%)</th>
              <th>Комиссия провайдера (%)</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => (
              <tr key={method._id} className={!method.isActive ? 'inactive' : ''}>
                <td>
                  <div className="method-info">
                    {method.image && (
                      <img src={method.image} alt={method.providerMethod} className="method-icon" />
                    )}
                    <span>{method.providerMethod}</span>
                  </div>
                </td>
                <td>{getProviderDisplayName(method.provider)}</td>
                <td>
                  <span className="currency-pair">
                    {method.fromCurrencyCode} → {method.toCurrencyCode}
                  </span>
                </td>
                <td>
                  <span className="limits">
                    {formatCurrency(method.min)} - {formatCurrency(method.max)}
                  </span>
                </td>
                <td>
                  {editingMethod?.id === method._id ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={editingMethod.relativeCommission}
                      onChange={(e) => handleCommissionChange('relativeCommission', e.target.value)}
                      className="commission-input"
                    />
                  ) : (
                    <span className="commission">{method.relativeCommission}%</span>
                  )}
                </td>
                <td>
                  {editingMethod?.id === method._id ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={editingMethod.relativeProviderCommission}
                      onChange={(e) => handleCommissionChange('relativeProviderCommission', e.target.value)}
                      className="commission-input"
                    />
                  ) : (
                    <span className="commission">{method.relativeProviderCommission}%</span>
                  )}
                </td>
                <td>
                  {editingMethod?.id === method._id ? (
                    <label className="status-toggle">
                      <input
                        type="checkbox"
                        checked={editingMethod.isActive}
                        onChange={(e) => setEditingMethod({
                          ...editingMethod,
                          isActive: e.target.checked
                        })}
                      />
                      <span className={`status ${editingMethod.isActive ? 'active' : 'inactive'}`}>
                        {editingMethod.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </label>
                  ) : (
                    <span className={`status ${method.isActive ? 'active' : 'inactive'}`}>
                      {method.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  )}
                </td>
                <td>
                  <div className="actions">
                    {editingMethod?.id === method._id ? (
                      <>
                        <button
                          onClick={handleSaveCommissions}
                          disabled={saving}
                          className="btn btn-save"
                        >
                          {saving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="btn btn-cancel"
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(method)}
                        className="btn btn-edit"
                      >
                        Редактировать
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="btn btn-pagination"
          >
            Предыдущая
          </button>
          
          <span className="pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="btn btn-pagination"
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;