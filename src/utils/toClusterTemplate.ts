import {
  ArgoCDSpecFormikValues,
  WizardFormikValues,
} from '../components/ClusterTemplateWizard/types';
import { INSTANCE_NAMESPACE_VAR } from '../constants';
import { ArgoCDSpec, ClusterTemplate } from '../types';

const getArgoCDSpec = (values: ArgoCDSpecFormikValues, day2: boolean): ArgoCDSpec => {
  return {
    source: {
      repoURL: values.repo.url,
      chart: values.chart,
      targetRevision: values.version,
    },
    destination: {
      namespace: values.destinationNamespace,
      server: day2 ? '${new_cluster}' : 'https://kubernetes.default.svc',
    },
    project: 'default',
  };
};

export const toClusterTemplateSpec = (values: WizardFormikValues): ClusterTemplate['spec'] => {
  const postSettings = values.postInstallation
    .filter((formValues) => !!formValues.repo.url)
    .map((formValues) => ({
      name: formValues.chart,
      spec: getArgoCDSpec(formValues, true),
    }));
  const installationSpec = {
    ...values.installation.spec,
    destinationNamespace: values.installation.useInstanceNamespace
      ? INSTANCE_NAMESPACE_VAR
      : values.installation.spec.destinationNamespace,
  };
  return {
    cost: values.details.cost,
    clusterDefinition: getArgoCDSpec(installationSpec, false),
    clusterSetup: postSettings,
    argocdNamespace: values.details.argocdNamespace,
  };
};

const toClusterTemplate = (values: WizardFormikValues): ClusterTemplate => {
  return {
    apiVersion: 'clustertemplate.openshift.io/v1alpha1',
    kind: 'ClusterTemplate',
    metadata: {
      name: values.details.name,
    },
    spec: toClusterTemplateSpec(values),
  };
};

export default toClusterTemplate;
