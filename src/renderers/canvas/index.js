import React, { useRef, useEffect } from 'react'
import { fabric } from 'fabric'
import { diff } from 'deep-object-diff'
import {omit, isEmpty } from 'lodash';
import ReactReconciler from 'react-reconciler'
import * as Host from './hostImplementation'

const NO_CONTEXT = {}

/**
 * @type {ReactReconciler.HostConfig}
 */
const HostConfig = {
  now: Date.now,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  warnsIfNotActing: false,
  getRootHostContext: (rootContainer) => {
    return NO_CONTEXT
  },
  getChildHostContext: (parentHostContext, type, rootContainer) => {
    return NO_CONTEXT
  },
  getPublicInstance: (instance) => instance,
  prepareForCommit: (containerInfo) => {},
  resetAfterCommit: (containerInfo) => {},
  detachDeletedInstance: () => {},
  createInstance: (type, props, rootContainer) => {
    return Host.createInstance(type, props, rootContainer)
  },
  appendInitialChild: (parent, child) => {
    return Host.appendChild(parent.host, child.host)
  },
  finalizeInitialChildren: (instance, type, props, rootContainer) => {

  },
  shouldSetTextContent: (type, props) => false,

  supportsMutation: true,
  clearContainer: (container) => {
   
  },
  appendChildToContainer: (container, child) => {
    Host.appendChild(container, child.host)
  },
  removeChild: (parent, child) => {
    Host.removeChild(parent.host, child.host)
  },
  removeChildFromContainer: (container, child) => {
    Host.removeChild(container, child.host)
  },
  prepareUpdate: (_instance,_type,oldProps,newProps) => {
      const _oldProps = omit(oldProps,'children');
      const _newProps = omit(newProps,'children');
      const diffObject = diff(_oldProps,_newProps);
      return isEmpty(diffObject)? false: diffObject;
  },
  commitUpdate: (instance,updatePayload,type,prevProps,nextProps) => {
      Host.updateItem(instance.host,nextProps,instance.canvas);
  },
  insertBefore: (parent,child,beforeChild) => {
      Host.insertBefore(child.host,beforeChild.host,parent.host);
  },
  insertInContainerBefore: (container,child,beforeChild) => {
      Host.insertBefore(child.host,beforeChild.host,container);
  },
  appendChild: (parentInstance,child) => {
      Host.appendChild(parentInstance.host,child.host);
  },

}

const reconciler = ReactReconciler(HostConfig)

export function render(reactElement, hostElement) {
  if (!hostElement._root) {
    hostElement._root = reconciler.createContainer(hostElement)
  }

  reconciler.updateContainer(reactElement, hostElement._root)
  return reconciler.getPublicRootInstance(hostElement._root)
}

export function unmount(hostElement) {
  if (hostElement._root) {
    reconciler.updateContainer(null, hostElement._root, undefined, () => {
      delete hostElement._root
    })
  }
}

export const FabricCanvas = ({width=500,height=500,children}) => {
  const canvasRef = useRef()
  const canvasInstance = useRef()
  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current)
    canvasInstance.current = fabricCanvas
    render(children, fabricCanvas)

    return () => {
      unmount(fabricCanvas)
      fabricCanvas.dispose()
    }
  }, [])

  useEffect(()=> {
    canvasInstance.current.setWidth(width);
    canvasInstance.current.setHeight(height);
    canvasInstance.current.requestRenderAll();
  },[width,height])

  useEffect(() => {
    render(children, canvasInstance.current)
  }, [children])

  return <canvas ref={canvasRef} />
}
