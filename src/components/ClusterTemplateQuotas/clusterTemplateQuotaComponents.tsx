import React from 'react';

import { useClusterTemplateQuotaAccess } from '../../hooks/useQuotas';
import { useTranslation } from '../../hooks/useTranslation';
import { ClusterTemplateQuota } from '../../types';
import { LoadingHelper } from '../../utils/utils';

export const ClusterTemplateQuotaAccessSummary: React.FC<{
  quota: ClusterTemplateQuota;
}> = ({ quota }) => {
  const { t } = useTranslation();
  const [access, loaded, loadError] = useClusterTemplateQuotaAccess(quota);
  const users = t('{{count}} user', {
    count: access?.users.length,
  });
  const groups = t('{{count}} group', {
    count: access?.groups.length,
  });
  return <LoadingHelper isLoaded={loaded} error={loadError}>{`${users}, ${groups}`}</LoadingHelper>;
};

export const ClusterTemplateQuotaCostSummary: React.FC<{
  quota: ClusterTemplateQuota;
}> = ({ quota }) => {
  const costAllowed = quota.spec?.budget;
  const costSpent = quota.status?.budgetSpent || 0;
  if (costAllowed === undefined || costSpent === undefined) {
    return <>-</>;
  }
  return <>{`${costSpent} / ${costAllowed}`}</>;
};
